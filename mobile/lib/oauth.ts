/**
 * Mobile OAuth (Google / GitHub) sign-in.
 *
 * PENDING FRAMEWORK RELEASE — this module requires `signInWithOAuth`,
 * `loginWithOAuth` and `parseDeepLinkParams`, which ship in modelence 0.23.x
 * *dev* builds (`npm i modelence@dev`) and are NOT in the released 0.23.0.
 * See mobile/OAUTH.md for the enablement checklist.
 *
 * Flow: `signInWithOAuth` opens the provider in the device browser, the server
 * redirects back to our deep link carrying a single-use `code`, and
 * `loginWithOAuth` exchanges that code for a session over HTTPS. The token is
 * never in the redirect, because a custom scheme can be claimed by more than
 * one app on a device.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Linking from 'expo-linking';
import {
  loginWithOAuth,
  parseDeepLinkParams,
  signInWithOAuth,
} from 'modelence/client';

/** Providers the backend is configured for. Keep in sync with `src/server/app.ts`. */
export type OAuthProvider = 'google' | 'github';

/**
 * Path segment the OAuth callback returns to. Must line up with the route at
 * `mobile/app/auth.tsx` — on Expo Web the redirect is a real page load, so a
 * missing route shows "Unmatched Route" with `?code=` in the URL.
 */
const CALLBACK_PATH = 'auth';

/**
 * The deep link to hand the server, resolved for however the app is running:
 * `myapp://auth` in a native build, `exp://<host>/--/auth` under Expo Go, and
 * `https://<host>/auth` on Expo Web.
 *
 * Every one of those is a different string and each needs its own entry in the
 * server's `auth.mobile.redirectUrls` allowlist — the server matches on scheme,
 * host and path, so an Expo Go host that follows your LAN address will not
 * match a committed entry. Log this value and allowlist it verbatim.
 */
export function getOAuthRedirectUri(): string {
  return Linking.createURL(CALLBACK_PATH);
}

/**
 * Starts an OAuth sign-in. Resolves once the browser has been handed off — the
 * session does not exist yet; `useOAuthCallback` completes it when the deep
 * link comes back.
 */
export async function startOAuthSignIn(provider: OAuthProvider): Promise<void> {
  await signInWithOAuth({ provider, redirectUri: getOAuthRedirectUri() });
}

/**
 * Redeems the `code` from an OAuth deep link, from either entry point:
 *
 * - cold start, where the link launched the app and only `getInitialURL`
 *   has it — without this the sign-in would silently do nothing;
 * - warm start, where the app was already running and the `url` event fires.
 *
 * Both can deliver the same link, and the code is single-use, so redemptions
 * are deduped. Mount this once, above the auth-gated part of the tree.
 */
export function useOAuthCallback({
  onError,
}: { onError?: (message: string) => void } = {}) {
  const [isCompleting, setIsCompleting] = useState(false);

  // Refs, not state: these must not re-run the subscription effect, and the
  // handled set has to survive re-renders to keep dedupe honest.
  const handledCodes = useRef(new Set<string>());
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    let isMounted = true;

    async function complete(url: string | null) {
      if (!url) return;

      const { code, error, errorCode } = parseDeepLinkParams(url);

      if (error) {
        // `errorCode` is the stable machine-readable half (e.g. 'invalid_state');
        // `error` is display text. Log both so a failure is diagnosable.
        console.error(`OAuth sign-in failed [${errorCode ?? 'unknown'}]: ${error}`);
        onErrorRef.current?.(error);
        return;
      }

      if (!code || handledCodes.current.has(code)) return;
      handledCodes.current.add(code);

      setIsCompleting(true);
      try {
        await loginWithOAuth({ code });
        // useSession() now reports the signed-in user; the route guard in
        // app/_layout.tsx redirects away from the auth group on its own.
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
        console.error('OAuth code exchange failed:', err);
        onErrorRef.current?.(message);
      } finally {
        if (isMounted) setIsCompleting(false);
      }
    }

    // Cold start: the deep link launched the app, so the `url` event never fires.
    Linking.getInitialURL().then(complete).catch((err) => {
      console.error('Failed to read initial OAuth URL', err);
    });

    // Warm start: the app was already running.
    const subscription = Linking.addEventListener('url', ({ url }) => {
      complete(url);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return { isCompleting };
}

/**
 * Button-facing wrapper: tracks which provider is mid-flight so the pressed
 * button can show a spinner, and surfaces start-up failures (a `redirectUri`
 * missing from the allowlist is rejected here, before the browser opens).
 */
export function useOAuthSignIn({
  onError,
}: { onError?: (message: string) => void } = {}) {
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);

  const signIn = useCallback(
    async (provider: OAuthProvider) => {
      setPendingProvider(provider);
      try {
        await startOAuthSignIn(provider);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : `Could not start ${provider} sign-in.`;
        // The most common cause is the resolved redirect URI not being
        // allowlisted server-side, which varies per build target.
        console.error(
          `Failed to start ${provider} OAuth (redirectUri: ${getOAuthRedirectUri()})`,
          err
        );
        onError?.(message);
        setPendingProvider(null);
      }
    },
    [onError]
  );

  // Deliberately not cleared on success: the browser is now in front of the
  // user and the button should stay busy until the app is navigated away.
  return { signIn, pendingProvider };
}
