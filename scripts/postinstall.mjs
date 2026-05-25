#!/usr/bin/env node
// Runs after `npm install` at the project root. If the user has explicitly
// opted into the mobile app (the studio writes `mobile/.modelence-mobile-enabled`
// when scaffolding via "Create mobile app"), install Expo dependencies inside
// `mobile/` so the project stays usable across fresh clones and CI.
//
// No-ops when:
//   - the `mobile/` folder is absent, or
//   - the marker file is missing (template ships `mobile/` unhooked).

import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const MARKER = 'mobile/.modelence-mobile-enabled';

if (!existsSync(MARKER)) {
  process.exit(0);
}

console.log('[postinstall] mobile marker present — installing mobile dependencies');
execSync('npm install --prefix mobile --no-audit --no-fund', { stdio: 'inherit' });
