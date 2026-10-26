# Mobile app (Expo) — agent guide

Read this file before setting up, changing, or debugging anything under `mobile/`.
The short rules live in the root `AGENTS.md` (section 11, "MOBILE APP"); this file
covers the full setup flow, running the app locally, troubleshooting, and
publishing.

Expo (React Native) under `mobile/` is the only supported way to add a mobile app
to a Modelence project. Do NOT propose a PWA, "add to home screen", a mobile-web
alternative, or any non-Expo path, and do not ask the user which approach to take.

## Creating the mobile app

The template ships `mobile/` fully scaffolded but unhooked: the app counts as
"not yet created" until `mobile/.modelence-mobile-enabled` exists. When the user
asks to create, add, or set up a mobile app, follow these steps in order.

Do NOT run `create-expo-app` or hand-write the scaffold. The shipped files carry
the SDK-pinned dependency set, the Expo Router layout with Modelence auth wiring,
and the `mobile/components/ui/` component library. If any of them are missing,
restore them from git rather than recreating them.

### 1. Personalize `mobile/app.config.js`

Set `name` to the project's display name, and `slug` + `scheme` to its
lowercase-kebab-case form ("My App" → `my-app`). Leave everything else — the
`bundleId` const, the `EAS_*` env reads, `extra.modelenceBaseUrl` — exactly as
shipped. Those are injected at build time; overwriting them breaks publishing.

### 2. Install dependencies

Note the `expo` version in `mobile/package.json` BEFORE installing.

Inside `mobile/`, run `npm install`, then `./node_modules/.bin/expo install --fix`.
Both must succeed before continuing.

`expo install --fix` aligns packages to the SDK and may rewrite the `expo` entry.
If it changed, restore the original value verbatim and re-run `npm install`. Do
NOT tighten or loosen that range on your own — drifting off it can pick up a CLI
that drops env vars the Modelence mobile preview depends on.

Finally run `./node_modules/.bin/expo install --check` and resolve anything it
reports. A dependency that does not match the SDK makes Expo Go boot to a blank
white screen with no error.

### 3. Build the mobile version of this app

The scaffolded screens (`(auth)/sign-in`, `(app)/home`) are PLACEHOLDERS. The goal
is a mobile version of THIS project: reproduce the web app under `src/client/` as
native screens backed by the same Modelence queries and mutations.

Gauge the size of the web app first — its meaningful screens, features, and the
queries/mutations it exposes — then pick one path:

- **Small / medium (up to ~6 screens):** port it fully. Recreate every page as a
  native screen under `mobile/app/`, wire each to the same queries/mutations via
  `@modelence/react-query`, and keep the navigation structure (auth flow vs.
  signed-in app).
- **Large:** do NOT port everything in one shot. Ask the user whether they want a
  minimal version covering the core flow (auth + the 1–3 most important screens)
  and which screens matter most. Build that set now and say the rest can follow.
  Port the whole app only if they explicitly ask for full parity.

Either way, replace the placeholder screens with real UI on the project's actual
data and auth — no lorem ipsum. Build with `mobile/components/ui/`, styled
natively, matching the web app's information and behavior rather than its
HTML/CSS.

Reuse the existing queries and mutations as-is. Read `src/` freely, but keep code
changes scoped to `mobile/` (plus `src/shared/` for logic shared by both clients).
Do not modify the web client, `vite.config.ts`, or `modelence.config.ts` as part
of mobile setup.

### 4. Write the readiness marker — last

Write an empty `mobile/.modelence-mobile-enabled` only after steps 1–3 have
succeeded and the checklist below passes. The studio treats the app as fully
usable once the marker exists, and the root `postinstall` starts re-installing
mobile deps from then on. Writing it early advertises a broken setup as ready.

### Completion checklist

- [ ] `mobile/app.config.js` has the project's `name`, `slug`, and `scheme`
- [ ] `mobile/node_modules/expo` exists, and `expo install --check` is clean
- [ ] The `expo` entry in `mobile/package.json` is unchanged from the template
- [ ] Placeholder screens replaced with real UI wired to the project's queries/mutations
- [ ] `npx tsc --noEmit` passes inside `mobile/`
- [ ] Every `router.push` / `<Link href>` / `<Redirect href>` points at a route
      that exists under `mobile/app/` (group segments like `(app)` are not part
      of the URL)
- [ ] `mobile/.modelence-mobile-enabled` exists

## Running the app locally (outside Studio)

In Studio, the sandbox starts Expo and points the app at the sandbox backend
itself — skip this section there, and do not create `mobile/.env` or start Expo
processes in the sandbox. This section is for a local checkout.

### Two servers must run

- **The Modelence backend** — `npm run dev` at the repo ROOT. It answers the
  app's `/api/_internal/method/*` calls. It needs `.modelence.env` at the root;
  that file is gitignored, so a fresh clone has none. If it is missing, tell the
  user to run `npx modelence setup`. NEVER create or guess this file.
- **Expo/Metro** — `npm run start` inside `mobile/` (or `npm run dev:mobile` at
  the root). It only serves the JS bundle. `mobile/` has NO `dev` script.

Verify the backend with `lsof -nP -iTCP:3000 -sTCP:LISTEN` rather than assuming.
A missing backend is the most common cause of "Failed to fetch" on first launch.

### Point the app at the backend (`mobile/.env`)

`app.config.js` reads `MODELENCE_SITE_URL` and falls back to
`https://localhost:3000` — the wrong scheme for a local dev server, which speaks
`http`. Create `mobile/.env` (gitignored) and choose the value by where the app
runs:

- **Simulator, or a device on the same Wi-Fi** — the machine's LAN IP over
  `http`. Find it with `ipconfig getifaddr en0` (macOS) or
  `hostname -I | awk '{print $1}'` (Linux). `localhost` does NOT work on a
  physical device: it resolves to the phone itself.

  ```
  MODELENCE_SITE_URL=http://192.168.1.42:3000
  ```

- **A deployed Modelence Cloud environment** — works from any network, including
  tunnels and guest Wi-Fi:

  ```
  MODELENCE_SITE_URL=https://your-app.modelence.app
  ```

Use `http` for a local/LAN server and `https` only for a deployed one. Port
`3000` is the default; if the root dev server uses another (`MODELENCE_PORT` or
`PORT`), use that.

`app.config.js` is evaluated once when Expo starts. After creating or editing
`mobile/.env`, restart with `./node_modules/.bin/expo start --clear`. If the old
URL still reaches the bundle, clear the Metro file maps (see Troubleshooting).

## Troubleshooting

### Metro: "Unable to resolve", "Asset not found", or "Failed to get the SHA-1"

When Metro names a file you can SEE on disk — `Unable to resolve
"@expo/metro-runtime/rsc/runtime"`, `Asset not found: .../chevron-left.png`,
`Failed to get the SHA-1 for: ...` — the cause is a STALE METRO CACHE, not a
broken package. Metro persists a file map keyed by project path; when
`node_modules` changes underneath it, the old map still points at the previous
tree.

Confirm first, inside `mobile/`:

```bash
ls node_modules/@expo/metro-runtime/rsc/runtime.js
./node_modules/.bin/expo install --check
```

A file that exists plus `Dependencies are up to date` means: do NOT reinstall,
do NOT change versions, do NOT "fix" the dependency.

`expo start --clear` alone is NOT enough — it can leave the `metro-file-map-*`
entries that carry the bad paths. Clear everything (locally; in Studio, the
sandbox manages Expo):

```bash
rm -rf "$TMPDIR"/metro-cache "$TMPDIR"/metro-file-map-*
rm -rf mobile/.expo mobile/node_modules/.cache
cd mobile && ./node_modules/.bin/expo start --clear
```

Recovery ends with a `Bundled ... (N modules)` line and no resolution errors.
Suspect the install itself only if errors persist after a full clear.

### "Failed to fetch" / "Network request failed" at startup

A `TypeError: Failed to fetch` (Expo Web) or `Network request failed` (native)
with a minified stack in `node_modules/modelence/dist/chunk-*.js`, thrown from a
`useEffect` on first render, is the boot-time `_system.session.init` call failing
to reach the server. It is a connectivity/config problem — do not edit
`modelence/dist` or the screens.

Every cause produces the same message, so run the checks instead of guessing:

1. **Is anything listening?** From the repo root:
   `lsof -nP -iTCP:3000 -sTCP:LISTEN || echo "NOTHING ON 3000"`. Empty means the
   backend is not running — start `npm run dev` at the ROOT. Check the listener's
   working directory: a server from a different project may hold the port.
2. **Does the endpoint answer?** Curl the exact URL from `mobile/.env`:

   ```bash
   curl -i -X POST http://192.168.1.42:3000/api/_internal/method/_system.session.init \
     -H 'Content-Type: application/json' -d '{"args":{}}'
   ```

   `Connection refused` → back to check 1. A hang or timeout → firewall or wrong
   network. `200` → the server is fine; continue with the client checks.
3. **Where does the app run?** A stack mentioning `react-dom-client` is Expo Web
   in a browser, where `localhost` reaches the dev machine. On a device, a LAN IP
   is required.
4. **Is `MODELENCE_SITE_URL` set and reachable from there?** Unset, it falls back
   to `https://localhost:3000`.
5. **Does the scheme match?** `https://` against a plain-`http` dev server fails
   the TLS handshake.
6. **Did the new value reach the bundle?** Grep the bundle for the exact host
   from `mobile/.env`:

   ```bash
   curl -s "http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true" \
     | grep -c 'your-app.modelence.app'
   ```

   Non-zero means it landed; `0` means the bundle is stale — clear the Metro file
   maps (previous section). Grep for one specific host, not every URL: the bundle
   is full of Metro's own `localhost:8081` URLs.

## App identifier (Android package / iOS bundle id)

The `bundleId` const in `mobile/app.config.js` is used for both `android.package`
and `ios.bundleIdentifier`. It reads `EAS_BUNDLE_IDENTIFIER` (injected by
Modelence Cloud at build time) and falls back to a literal default.

When the user asks to change the package name or bundle id (e.g. "my Play
submission was rejected", "change it to com.acme.myapp"):

- Before the first Cloud build, edit the fallback literal in that single const.
  Never give Android and iOS different values.
- After a Cloud build has run, editing the file has no effect: the platform has
  recorded the identifier and injects it into every later build. Direct the user
  to the Publish flow instead. After the app is published it cannot change at all.

Rules to enforce:

- Reverse-DNS on a domain the USER controls (`com.theircompany.theirapp`). The
  default `app.modelence.*` is on a domain they do not own, and Google Play
  rejects submissions under it.
- Lowercase only; each dot-separated segment starts with a letter and contains
  only letters, digits, and `_`. Hyphens are invalid.
- WARN before changing it on an app that has already shipped: store listings are
  keyed on this identifier permanently, so a new value creates a separate listing
  and abandons existing installs and reviews.

## Production builds

Production builds (`.aab` / `.ipa`) are produced by EAS with the user's own Expo
account. Do NOT run `eas build` or `eas login`, or hand-edit EAS credentials — you
do not have their Expo token, and for Modelence Cloud projects the platform runs
the build from the Mobile tab's "Production builds" panel.

If asked to set up builds, you MAY ensure `mobile/eas.json` exists and that
`mobile/app.config.js` has an Android `package` and an iOS `bundleIdentifier`
(both required by EAS), then hand the build itself back to the user.
