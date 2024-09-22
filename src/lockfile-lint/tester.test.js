import {fileExists} from '@form8ion/core';

import any from '@travi/any';
import {describe, it, expect, vi} from 'vitest';
import {when} from 'jest-when';

import lockfileLintIsUsed from './tester.js';

vi.mock('@form8ion/core');

describe('lockfile-lint predicate', () => {
  const projectRoot = any.string();

  it('should return `true` when a config file is present', async () => {
    when(fileExists).calledWith(`${projectRoot}/.lockfile-lintrc.json`).mockResolvedValue(true);

    expect(await lockfileLintIsUsed({projectRoot})).toBe(true);
  });

  it('should return `false` when no config file is present', async () => {
    when(fileExists).calledWith(`${projectRoot}/.lockfile-lintrc.json`).mockResolvedValue(false);

    expect(await lockfileLintIsUsed({projectRoot})).toBe(false);
  });
});
