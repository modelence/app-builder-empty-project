import { startApp } from 'modelence/server';
import exampleModule from '@/server/example';
import { createDemoUser } from '@/server/migrations/createDemoUser';
import { authErrorPage } from '@/server/authErrorPage';

startApp({
  modules: [exampleModule /* Add your modules here */],

  auth: {
    // OAuth errors render at the provider callback URL, outside the React app,
    // so without this the user lands on a raw JSON body with no way back.
    errorComponent: authErrorPage,
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
