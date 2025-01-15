import {fileExists} from '@form8ion/core';

import {expect, describe, it, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import yarnIsUsed from './tester.js';

vi.mock('@form8ion/core');

describe('yarn predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` is a `yarn.lock` exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/yarn.lock`).mockResolvedValue(true);

    expect(await yarnIsUsed({projectRoot})).toBe(true);
  });

  it('should return `false` is a `yarn.lock` does not exist', async () => {
    when(fileExists).calledWith(`${projectRoot}/yarn.lock`).mockResolvedValue(false);

    expect(await yarnIsUsed({projectRoot})).toBe(false);
  });

  it('should return true if the package manager is pinned to yarn', async () => {
    expect(await yarnIsUsed({projectRoot, pinnedPackageManager: 'yarn@1.2.3'})).toBe(true);
  });
});
