import {fileExists} from '@form8ion/core';
import {packageManagers} from '@form8ion/javascript-core';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import derive from './package-manager';

vi.mock('@form8ion/core');

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
    when(fileExists).calledWith(`${projectRoot}/package-lock.json`).mockResolvedValue(true);

    expect(await derive({projectRoot})).toEqual(packageManagers.NPM);
  });

  it('should return `yarn` when a `yarn.lock` exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/package-lock.json`).mockResolvedValue(false);
    when(fileExists).calledWith(`${projectRoot}/yarn.lock`).mockResolvedValue(true);

    expect(await derive({projectRoot})).toEqual(packageManagers.YARN);
  });

  it('should throw an error when no manager is provided and no lockfile is found', async () => {
    when(fileExists).calledWith(`${projectRoot}/package-lock.json`).mockResolvedValue(false);
    when(fileExists).calledWith(`${projectRoot}/yarn.lock`).mockResolvedValue(false);

    await expect(() => derive({projectRoot})).rejects.toThrowError('Package-manager could not be determined');
  });
});
