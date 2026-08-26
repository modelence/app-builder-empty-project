# Mobile OAuth (Google / GitHub)

Boilerplate for native OAuth sign-in is in place but **inactive**: it depends on
framework APIs that are still in development.

## Status

| | |
|---|---|
| Installed | `modelence@0.22.2` (root and `mobile/`) |
| Required | `modelence@0.23.x` **dev** build — `npm view modelence dist-tags` → `dev` |
| Released `0.23.0` | Does **not** include these APIs — the `latest` tag is not enough |

The three client APIs this code needs — `signInWithOAuth`, `loginWithOAuth`,
`parseDeepLinkParams` — plus the server's `auth.mobile.redirectUrls` option
exist only on the framework's `feat/mobile-oauth` branch, published under the
`dev` dist-tag. Until that lands in a stable release, the imports in
`mobile/lib/oauth.ts` will not resolve.

## Enabling

1. **Upgrade the framework** in both `package.json` files (they have separate
   dependency trees):

   ```bash
   npm i modelence@dev            # repo root
   cd mobile && npm i modelence@dev
   ```

   Pin the exact version rather than tracking `dev`, which moves.

2. **Uncomment the `auth.mobile` block** in [`src/server/app.ts`](../src/server/app.ts).

3. **Allowlist your redirect URI.** This is the step that most often goes wrong.
   `Linking.createURL('auth')` returns a *different* string per build target,
   and the server matches on scheme, host and path:

   | Target | Resolves to | Stable? |
   |---|---|---|
   | Standalone / dev-client | `modelence-mobile://auth` | Yes — commit it |
   | Expo Web | `https://<host>/auth` | Per deployment host |
   | Expo Go | `exp://192.168.x.x:8081/--/auth` | No — follows LAN/tunnel |

   Log the real value and paste it in verbatim:

   ```ts
   import { getOAuthRedirectUri } from './lib/oauth';
   console.log('OAuth redirectUri:', getOAuthRedirectUri());
   ```

   Commit the stable entry to `startApp`; put the volatile Expo Go host in the
   env var so it changes without a redeploy:

   ```bash
   MODELENCE_AUTH_MOBILE_REDIRECT_URLS=exp://192.168.1.5:8081/--/auth,https://preview-host/auth
   ```

4. **Configure the providers** — the same `auth.google` / `auth.github` client
   ID and secret a web app uses. The provider-side redirect URI stays your
   server's `…/api/_internal/auth/<provider>/callback`; the deep link is
   Modelence's own hop afterwards, not something the provider sees.

## What's already wired

| File | Role |
|---|---|
| [`mobile/lib/oauth.ts`](lib/oauth.ts) | `useOAuthSignIn` (start) and `useOAuthCallback` (redeem), redirect-URI resolution |
| [`mobile/app/_layout.tsx`](app/_layout.tsx) | Mounts the callback hook; route guard holds still mid-exchange |
| [`mobile/app/(auth)/sign-in.tsx`](app/(auth)/sign-in.tsx) | Provider buttons with per-provider loading state |
| [`mobile/app/auth.tsx`](app/auth.tsx) | Callback route — required for Expo Web, unused natively |
| [`mobile/index.ts`](index.ts) | `openUrl: Linking.openURL` in `configureClient` |

## How the flow works

`signInWithOAuth` opens the provider in the **system browser** (not a WebView),
the server redirects back to the deep link with a single-use `code`, and
`loginWithOAuth` exchanges it for a session over HTTPS.

The redirect carries a code rather than the token because a custom URL scheme
can be claimed by more than one app on a device — a token in the URL could be
picked up by an app that isn't yours. The code is additionally bound to the
client that started the flow, so a `…://auth?code=` link arriving from anywhere
else is rejected before it is sent.

Two consequences worth knowing:

- **Cold start matters.** If the deep link launches the app, the `url` event
  never fires and only `Linking.getInitialURL()` has it. `useOAuthCallback`
  handles both and dedupes, since the code is single-use.
- **The verifier is in memory on native.** Killing the app mid-flow means the
  sign-in must be restarted. In browsers it is mirrored to `sessionStorage` so
  the Expo Web navigation survives.

## Linking to an existing account

For an already signed-in user, `linkOAuthProvider` takes the same `redirectUri`
so the flow returns to the app instead of ending in the browser:

```ts
await linkOAuthProvider({ provider: 'github', redirectUri: getOAuthRedirectUri() });
// returns to <scheme>://auth?linked=github
```
