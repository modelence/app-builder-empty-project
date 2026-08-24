import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';

/**
 * The email verification link redirects back to the app with a `status` query
 * param (see `auth.email.verification`). By default it lands on the site root
 * with the user already signed in, so this is handled app-wide rather than on
 * the login page.
 */
export function useEmailVerificationStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status !== 'verified' && status !== 'error') {
      return;
    }

    if (status === 'verified') {
      toast.success("You're verified — welcome!");
    } else {
      toast.error(
        'That verification link is invalid or has expired. Try signing in to request a new one.'
      );
    }

    // Strip the param so a refresh doesn't re-fire the toast.
    const next = new URLSearchParams(searchParams);
    next.delete('status');
    setSearchParams(next, { replace: true });
  }, [status, searchParams, setSearchParams]);
}
