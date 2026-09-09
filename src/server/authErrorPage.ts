/**
 * Sends a failed OAuth sign-in back into the React app.
 *
 * OAuth errors are produced at the provider callback URL
 * (`/api/_internal/auth/...`), which is a server route: the client bundle never
 * loads and the router never runs, so nothing there can be a React page. Rather
 * than render a standalone document that looks nothing like the rest of the app,
 * this bounces the browser back into the app, which shows the message as a toast
 * in the normal UI.
 *
 * The bounce is a meta-refresh because `errorComponent`'s contract is to return
 * an HTML body, not to control the status code — a 400 with a `Location` header
 * would not be followed.
 */

/**
 * Where the error is shown.
 *
 * The site root, not `/login`: account-linking failures reach this same
 * component while the user is signed in, and `/login` is a GuestRoute that
 * would immediately bounce them to `/` anyway. The toast is wired app-wide in
 * `RootLayout`, so it shows on whichever route the user lands on — and a signed-
 * out user still sees "Sign in" from the home page.
 */
const REDIRECT_PATH = '/';

/**
 * Query param carrying the message. Deliberately not `status=error`, which
 * `useEmailVerificationStatus` already claims app-wide and reports as a failed
 * *verification* link — a different failure with a different remedy.
 */
const ERROR_PARAM = 'authError';

/**
 * Escapes text for interpolation into HTML.
 *
 * The message is URL-encoded into an attribute, so this is belt-and-braces
 * rather than the only defence. Both are applied because the value is a plain
 * string with no guarantee about its origin, and an error built from a provider
 * response one day should not silently become an injection.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function authErrorPage({ error }: { error: string }): string {
  const target = `${REDIRECT_PATH}?${ERROR_PARAM}=${encodeURIComponent(error)}`;
  const escaped = escapeHtml(target);

  // The <a> is a fallback for the rare client that ignores meta-refresh, so the
  // user is never stranded on a blank page.
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${escaped}">
<title>Sign-in failed</title>
</head>
<body>
  <p><a href="${escaped}">Continue</a></p>
</body>
</html>`;
}
