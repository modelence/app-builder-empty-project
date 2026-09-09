import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';

/**
 * Handles the `?authError=` param set by the OAuth `errorComponent`.
 *
 * A failed OAuth sign-in cannot render a React page — it happens at the provider
 * callback URL, outside the router — so the server bounces to `/login` with the
 * message in the URL and this surfaces it once the app has mounted.
 *
 * Its own param rather than the `?status=error` used by
 * `useEmailVerificationStatus`: that one reports an expired *verification* link,
 * which is a different failure with a different remedy.
 */
export function useAuthErrorStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get('authError');

  // useSearchParams returns unstable values, so the effect can re-run before the
  // param strip commits. Latch to toast once per message.
  const notifiedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!message) {
      notifiedRef.current = null;
      return;
    }

    if (notifiedRef.current === message) {
      return;
    }
    notifiedRef.current = message;

    toast.error(message);

    // Strip the param so a refresh doesn't re-toast.
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete('authError');
        return next;
      },
      { replace: true }
    );
  }, [message, setSearchParams]);
}
