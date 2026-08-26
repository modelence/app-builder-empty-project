import { startApp } from 'modelence/server';
import exampleModule from '@/server/example';
import { createDemoUser } from '@/server/migrations/createDemoUser';

startApp({
  modules: [exampleModule /* Add your modules here */],

  /**
   * PENDING FRAMEWORK RELEASE — `auth.mobile` requires a modelence 0.23.x dev
   * build (`npm i modelence@dev`); it is not in the released 0.23.0. Uncomment
   * together with the mobile OAuth client code. See mobile/OAUTH.md.
   *
   * Deep links the OAuth callback may return a native app to. There is no
   * default: mobile OAuth stays disabled until an entry exists here or in the
   * `MODELENCE_AUTH_MOBILE_REDIRECT_URLS` config value (the two are merged).
   *
   * Entries match on scheme, host and path, and each build target resolves to
   * a different string — so a standalone build, Expo Web and Expo Go each need
   * their own entry. Keep the volatile ones (Expo Go's LAN/tunnel host) in the
   * env var rather than here.
   */
  // auth: {
  //   mobile: { redirectUrls: ['modelence-mobile://auth'] },
  // },

  security: {
    frameAncestors: ['https://modelence.com', 'https://*.modelence.com', 'http://localhost:*', 'https://*.exp.direct'],
  },

  migrations: [{
    version: 1,
    description: 'Create demo user',
    handler: createDemoUser,
  }],
});
