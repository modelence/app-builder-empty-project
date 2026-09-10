import { toast } from 'react-hot-toast';
import { useToastOnceFromParams } from './useToastOnceFromParams';

/**
 * Messages shown for a failed OAuth sign-in, keyed by the framework's
 * `errorCode`.
 *
 * The accompanying `?error=` text is never displayed. It arrives in a URL, so
 * anyone can craft a link that makes the app render text they wrote on our own
 * origin — a convincing place to put a fake "call this number" notice. These
 * strings are app-owned, so the worst a crafted link achieves is showing one of
 * the messages below.
 */
const MESSAGES: Record<string, string> = {
  // The state parameter didn't match: usually a stale or reused callback.
  invalid_state: 'That sign-in link has expired. Please try again.',
  // A mobile deep-link target that isn't in auth.mobile.redirectUrls; reported
  // on the web callback because there's no vetted app to redirect back to.
  invalid_redirect: "We couldn't complete sign-in. Please try again.",
};

/**
 * Shown for `oauth_failed` — the framework's default code — and any code added
 * upstream that we don't know yet.
 *
 * Deliberately vague: `oauth_failed` covers everything from a provider outage
 * to "this email already has an account", and the detail that separates them
 * lives only in the untrusted `?error=` text. Guessing a specific cause from an
 * unspecific code would be worse than saying little.
 */
const FALLBACK = 'Sign-in failed. Please try again.';

/**
 * Surfaces a failed OAuth sign-in as a toast.
 *
 * A failed OAuth sign-in cannot render a React page — it happens at the provider
 * callback URL, outside the router — so `auth.oauthErrorRedirectUrl` bounces
 * back into the app with `?error=<message>&errorCode=<code>` and this shows it
 * once the app has mounted.
 *
 * Keyed on `errorCode`, not the `?status=error` used by
 * `useEmailVerificationStatus`: that one reports an expired *verification* link,
 * a different failure with a different remedy.
 */
export function useAuthErrorStatus() {
  useToastOnceFromParams(
    'errorCode',
    (code) => {
      toast.error(MESSAGES[code] ?? FALLBACK);
    },
    ['error']
  );
}
