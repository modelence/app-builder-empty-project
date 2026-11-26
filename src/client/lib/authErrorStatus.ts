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
  // A mobile-flagged callback whose redirect target is missing or no longer
  // passes auth.mobile.redirectUrls (re-checked at the callback), so there's no
  // app deep link to report the failure to and it lands on the web.
  invalid_redirect: "We couldn't complete sign-in. Please try again.",
  // The provider's email already belongs to an account that can't be linked
  // automatically (with the default oauthAccountLinking: 'manual', a password
  // account).
  email_exists:
    'This email already has an account. Please sign in with email and password.',
  // The matching account is disabled or deleted.
  account_inactive: 'This account is no longer active.',
  // An onBeforeSignup hook refused the OAuth signup. Its message arrives only
  // in the untrusted `?error=` text, so show a generic line instead.
  signup_rejected: "We couldn't create an account with this sign-in.",
  // Linking a provider requires a signed-in user, and the session was gone.
  not_signed_in: 'Please sign in before linking another account.',
  // The provider account is linked to another user, or a different account of
  // that provider is already linked to this one.
  link_failed: "We couldn't link that account. It may already be linked to another user.",
};

/**
 * Shown for `oauth_failed` — the framework's default code — and any code added
 * upstream that we don't know yet.
 *
 * Deliberately vague: `oauth_failed` covers everything the codes above don't,
 * from a provider outage to a token exchange error, and the detail that
 * separates them lives only in the untrusted `?error=` text. Guessing a
 * specific cause from an unspecific code would be worse than saying little.
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
