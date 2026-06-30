const modelenceBaseUrl =
  process.env.MODELENCE_SITE_URL ?? 'https://localhost:3000';

// EAS project linkage + app id are injected at build time by the studio (the
// sandbox runs `eas init` against the user's Expo account and passes
// EAS_PROJECT_ID / EAS_OWNER / EAS_BUNDLE_IDENTIFIER). Reading them from env
// keeps this dynamic config in sync without hand-editing, and lets `eas init`
// resolve `expo.owner` for robot/organization tokens that have no personal
// account. The bundle id falls back to a slug-derived default so local/dev
// evaluation still works.
const easProjectId = process.env.EAS_PROJECT_ID;
const easOwner = process.env.EAS_OWNER;
// Fallback segment must be lowercase letters/digits only (no hyphens) — Android
// package segments can't contain '-'. e.g. 'modelence-mobile' → 'modelencemobile'.
const bundleId = process.env.EAS_BUNDLE_IDENTIFIER ?? 'app.modelence.modelencemobile';

module.exports = {
  expo: {
    name: 'Modelence Mobile',
    slug: 'modelence-mobile',
    scheme: 'modelence-mobile',
    version: '0.1.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
      // Declares the app uses no non-exempt encryption (the common case), so EAS
      // builds and App Store submission don't stop for manual export-compliance
      // input. Set to true only if you add custom/proprietary encryption.
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff',
      },
      package: bundleId,
    },
    web: {
      bundler: 'metro',
    },
    ...(easOwner ? { owner: easOwner } : {}),
    extra: {
      modelenceBaseUrl,
      ...(easProjectId ? { eas: { projectId: easProjectId } } : {}),
    },
  },
};
