import {promises as fs} from 'node:fs';
import {packageManagers} from '@form8ion/javascript-core';

import {beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {test as npmIsUsed} from './npm/index.js';
import {test as yarnIsUsed} from './yarn/index.js';
import derive from './current-manager-resolver.js';

vi.mock('node:fs');
vi.mock('./npm/index.js');
vi.mock('./yarn/index.js');

describe('package manager', () => {
  const projectRoot = any.string();
  const pinnedPackageManager = any.word();

  beforeEach(() => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .thenResolve(JSON.stringify({...any.simpleObject(), packageManager: pinnedPackageManager}));
  });

  it('should return an already defined manager directly', async () => {
    const packageManager = any.word();

    expect(await derive({packageManager})).toEqual(packageManager);
  });

  it('should return `npm` when a `package-lock.json` exists', async () => {
    when(npmIsUsed).calledWith({projectRoot, pinnedPackageManager}).thenResolve(true);

    expect(await derive({projectRoot})).toEqual(packageManagers.NPM);
  });

  it('should return `yarn` when a `yarn.lock` exists', async () => {
    when(npmIsUsed).calledWith({projectRoot, pinnedPackageManager}).thenResolve(false);
    when(yarnIsUsed).calledWith({projectRoot, pinnedPackageManager}).thenResolve(true);

    expect(await derive({projectRoot})).toEqual(packageManagers.YARN);
  });

  it('should throw an error when no manager is provided and no lockfile is found', async () => {
    when(npmIsUsed).calledWith({projectRoot, pinnedPackageManager}).thenResolve(false);
    when(yarnIsUsed).calledWith({projectRoot, pinnedPackageManager}).thenResolve(false);

    await expect(() => derive({projectRoot})).rejects.toThrowError('Package-manager could not be determined');
  });
});
