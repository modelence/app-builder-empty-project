import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';

/**
 * Handles the `?status=` param from the email verification link. It lands on
 * the site root by default, so this is wired app-wide, not on the login page.
 */
export function useEmailVerificationStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const status = searchParams.get('status');

  // useSearchParams returns unstable values, so the effect can re-run before
  // the param strip commits. Latch to toast once per status.
  const notifiedRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== 'verified' && status !== 'error') {
      notifiedRef.current = null;
      return;
    }

    // /reset-password uses the same ?status=error and shows its own message.
    if (pathname === '/reset-password') {
      return;
    }

    if (notifiedRef.current === status) {
      return;
    }
    notifiedRef.current = status;

    if (status === 'verified') {
      toast.success("You're verified — welcome!");
    } else {
      toast.error(
        'That verification link is invalid or has expired. Try signing in to request a new one.'
      );
    }

    // Strip the param so a refresh doesn't re-toast.
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete('status');
        return next;
      },
      { replace: true }
    );
  }, [status, pathname, setSearchParams]);
}
