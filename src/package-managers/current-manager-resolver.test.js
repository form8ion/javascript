import {packageManagers} from '@form8ion/javascript-core';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {test as npmIsUsed} from './npm/index.js';
import {test as yarnIsUsed} from './yarn/index.js';
import derive from './current-manager-resolver.js';

vi.mock('../package-managers/npm/index.js');
vi.mock('../package-managers/yarn/index.js');

describe('package manager', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an already defined manager directly', async () => {
    const packageManager = any.word();

    expect(await derive({packageManager})).toEqual(packageManager);
  });

  it('should return `npm` when a `package-lock.json` exists', async () => {
    when(npmIsUsed).calledWith({projectRoot}).mockResolvedValue(true);

    expect(await derive({projectRoot})).toEqual(packageManagers.NPM);
  });

  it('should return `yarn` when a `yarn.lock` exists', async () => {
    when(npmIsUsed).calledWith({projectRoot}).mockResolvedValue(false);
    when(yarnIsUsed).calledWith({projectRoot}).mockResolvedValue(true);

    expect(await derive({projectRoot})).toEqual(packageManagers.YARN);
  });

  it('should throw an error when no manager is provided and no lockfile is found', async () => {
    when(npmIsUsed).calledWith({projectRoot}).mockResolvedValue(false);
    when(yarnIsUsed).calledWith({projectRoot}).mockResolvedValue(false);

    await expect(() => derive({projectRoot})).rejects.toThrowError('Package-manager could not be determined');
  });
});
