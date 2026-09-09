import { startApp } from 'modelence/server';
import exampleModule from '@/server/example';
import { createDemoUser } from '@/server/migrations/createDemoUser';

startApp({
  modules: [exampleModule /* Add your modules here */],

  auth: {
    // Without this, a failed OAuth sign-in dead-ends on raw JSON at the callback
    // URL. Not `/login`: account-linking fails while signed in, and GuestRoute
    // would bounce those to `/` anyway.
    oauthErrorRedirectUrl: '/',
  },

  email: {
    // Without this the reset link redirects to the site root and dead-ends.
    passwordReset: {
      redirectUrl: '/reset-password',
    },
  },

  security: {
    frameAncestors: ['https://modelence.com', 'https://*.modelence.com', 'http://localhost:*', 'https://*.exp.direct'],
  },

  migrations: [{
    version: 1,
    description: 'Create demo user',
    handler: createDemoUser,
  }],
});
