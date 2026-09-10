import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

/**
 * Toasts once for a URL param, then strips it.
 *
 * Both the email-verification and OAuth-error links land on an ordinary route
 * carrying their result in the query string, so each needs the same two things:
 * fire exactly once, and clear the param so a refresh doesn't repeat it. That
 * shared mechanism lives here; what each param *means* stays with its caller.
 *
 * @param key      Param that triggers the toast; its value is the latch, so a
 *                 second distinct value toasts again.
 * @param onToast  Shows the toast. Returns `false` when the value should be
 *                 ignored entirely — the param is then left in the URL for
 *                 whoever does own it.
 * @param alsoStrip Companion params cleared alongside `key`.
 */
export function useToastOnceFromParams(
  key: string,
  onToast: (value: string) => false | void,
  alsoStrip: readonly string[] = []
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key);

  // useSearchParams returns unstable values, so the effect can re-run before the
  // param strip commits. Latch to toast once per value.
  const notifiedRef = useRef<string | null>(null);

  useEffect(() => {
    if (value === null) {
      notifiedRef.current = null;
      return;
    }

    if (notifiedRef.current === value) {
      return;
    }

    if (onToast(value) === false) {
      return;
    }

    notifiedRef.current = value;

    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params);
        next.delete(key);
        for (const extra of alsoStrip) {
          next.delete(extra);
        }
        return next;
      },
      { replace: true }
    );
    // `onToast` and `alsoStrip` are re-created per render by design; the latch,
    // not the dep list, is what keeps this firing once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value, setSearchParams]);
}
