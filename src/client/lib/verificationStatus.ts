import { useLocation } from 'react-router';
import { toast } from 'react-hot-toast';
import { useToastOnceFromParams } from './useToastOnceFromParams';

/**
 * Handles the `?status=` param from the email verification link. It lands on
 * the site root by default, so this is wired app-wide, not on the login page.
 */
export function useEmailVerificationStatus() {
  const { pathname } = useLocation();

  useToastOnceFromParams('status', (status) => {
    if (status !== 'verified' && status !== 'error') {
      return false;
    }

    // /reset-password uses the same ?status=error and shows its own message.
    // Returning false leaves the param in place for that page to read.
    if (pathname === '/reset-password') {
      return false;
    }

    if (status === 'verified') {
      toast.success("You're verified — welcome!");
    } else {
      toast.error(
        'That verification link is invalid or has expired. Try signing in to request a new one.'
      );
    }
  });
}
