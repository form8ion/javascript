import {packageManagers} from '@form8ion/javascript-core';

import {describe, it, expect} from 'vitest';

import determineLockfilePathFor from './lockfile-path-resolver.js';

describe('package manager lockfile path resolver', () => {
  it('should return `package-lock.json` for npm', () => {
    expect(determineLockfilePathFor(packageManagers.NPM)).toEqual('package-lock.json');
  });

  it('should return `yarn.lock` for yarn', () => {
    expect(determineLockfilePathFor(packageManagers.YARN)).toEqual('yarn.lock');
  });
});
