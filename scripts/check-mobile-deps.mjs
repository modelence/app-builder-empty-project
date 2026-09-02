#!/usr/bin/env node
// Warns when a dependency in `mobile/` does not match the version Expo Go's
// binary was compiled against.
//
// The Mobile preview runs in STOCK Expo Go from the App Store, not a custom dev
// client. Its native modules are frozen at the versions bundled into the SDK 54
// binary, and we cannot bump past that: customers open the preview with the
// store build. A dependency whose native side disagrees does not throw — the app
// boots to a blank white screen with no error, which is near-undebuggable from
// the preview alone. This check turns that silent failure into a log line.
//
// Advisory only, never fails the install. Once a user moves to a Test build
// (Publish Mobile App → Android → Test build) the native side is compiled from
// their own package set, so a mismatch here is a legitimate state rather than a
// bug — a hard failure would wedge them.
//
// Source of truth is `mobile/node_modules/expo/bundledNativeModules.json`, a
// name → version map that ships inside the installed SDK. Reading it (rather
// than hardcoding a list) means this check follows whatever SDK is installed and
// needs no edit when the template moves to SDK 55.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve every path against the repo root rather than the process cwd: this
// runs from the root (root postinstall) AND from mobile/ (mobile's own
// postinstall, which fires on `cd mobile && npm install <pkg>` — the exact
// command that causes the breakage). Deriving the root from this file's own
// location keeps both callers reading the same files.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const MARKER = join(REPO_ROOT, 'mobile/.modelence-mobile-enabled');
const MOBILE_PACKAGE_JSON = join(REPO_ROOT, 'mobile/package.json');
const BUNDLED_NATIVE_MODULES = join(
  REPO_ROOT,
  'mobile/node_modules/expo/bundledNativeModules.json',
);

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// Compare what is ACTUALLY INSTALLED against what Expo Go bundles — not the
// range declared in package.json. `~0.29.0` and `0.29.24` describe the same
// install, so comparing declared ranges reports differences that do not exist,
// and a warning that cries wolf gets ignored right when it matters.
function readInstalledVersion(name) {
  const installed = readJson(join(REPO_ROOT, 'mobile/node_modules', name, 'package.json'));
  return installed?.version ?? null;
}

// `bundledNativeModules.json` entries are `~x.y.z`, `^x.y.z` or an exact pin.
// Only the major (and for `~`, the minor) has to hold: Expo Go's native side is
// stable across the patch range the SDK ships, which is exactly what these
// operators encode. Hand-rolled because `semver` is only a transitive dep here —
// depending on it would break this check the moment the tree is deduped
// differently, and these three operators are the whole grammar in this file.
function satisfiesBundledRange(installedVersion, bundledRange) {
  const range = bundledRange.trim();
  const operator = range.startsWith('~') || range.startsWith('^') ? range[0] : '=';
  const target = operator === '=' ? range : range.slice(1);

  const installedParts = installedVersion.split('.').map(Number);
  const targetParts = target.split('.').map(Number);

  if (installedParts.some(Number.isNaN) || targetParts.some(Number.isNaN)) {
    // A tag or other non-numeric version: fall back to exact text comparison
    // rather than guessing, so an odd entry cannot produce a bogus warning.
    return installedVersion === target;
  }

  const [installedMajor, installedMinor] = installedParts;
  const [targetMajor, targetMinor] = targetParts;

  if (operator === '=') {
    return installedVersion === target;
  }

  if (installedMajor !== targetMajor) {
    return false;
  }

  // `^` allows any minor within the major; `~` pins the minor too.
  return operator === '^' || installedMinor === targetMinor;
}

function collectMismatches(dependencies, bundledNativeModules) {
  return Object.keys(dependencies)
    .filter((name) => Object.hasOwn(bundledNativeModules, name))
    .map((name) => ({
      name,
      installed: readInstalledVersion(name),
      bundled: bundledNativeModules[name],
    }))
    // A null install means the package is declared but not present — that is an
    // incomplete install, not a version mismatch, and reinstalling is the fix.
    .filter(({ installed, bundled }) => installed && !satisfiesBundledRange(installed, bundled));
}

export function checkMobileDeps() {
  // No marker means the user never opted into mobile — `mobile/` ships unhooked
  // in the template, so there is nothing to check and nothing to warn about.
  if (!existsSync(MARKER)) {
    return [];
  }

  const mobilePackageJson = readJson(MOBILE_PACKAGE_JSON);
  const bundledNativeModules = readJson(BUNDLED_NATIVE_MODULES);

  // Either file being unreadable means mobile deps are not installed yet (or the
  // tree is mid-install). That is not a mismatch, so stay quiet rather than
  // reporting a state the user cannot act on.
  if (!mobilePackageJson || !bundledNativeModules) {
    return [];
  }

  return collectMismatches(mobilePackageJson.dependencies ?? {}, bundledNativeModules);
}

export function formatWarning(mismatches) {
  const lines = [
    '',
    '⚠  Expo Go compatibility warning',
    '',
    `   ${mismatches.length} package(s) in mobile/ do not match the versions Expo Go`,
    "   was built with. Expo Go's native modules are fixed, so the Mobile preview",
    '   may boot to a blank white screen with no error:',
    '',
  ];

  for (const { name, installed, bundled } of mismatches) {
    lines.push(`     ${name}: installed ${installed}, Expo Go has ${bundled}`);
  }

  lines.push(
    '',
    '   Fix by pinning to the SDK versions:',
    `     cd mobile && ./node_modules/.bin/expo install ${mismatches.map(({ name }) => name).join(' ')}`,
    '',
    '   Invoke the local binary by path — `npx expo` downloads the LATEST CLI when',
    "   the local package isn't fully resolvable and runs it against this project.",
    '',
    '   If you intentionally added a native package Expo Go does not bundle, this',
    '   warning is expected: that package needs a Test build (Publish Mobile App →',
    '   Android → Test build) rather than the Expo Go preview.',
    '',
  );

  return lines.join('\n');
}

const mismatches = checkMobileDeps();
if (mismatches.length > 0) {
  console.warn(formatWarning(mismatches));
}
