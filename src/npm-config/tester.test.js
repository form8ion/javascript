import {fileExists} from '@form8ion/core';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import testForNpmConfig from './tester';

vi.mock('@form8ion/core');

describe('npm config predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` when an `.npmrc` file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.npmrc`).mockResolvedValue(true);

    expect(await testForNpmConfig({projectRoot})).toBe(true);
  });

  it('should return `false` when an `.npmrc` file does not exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.npmrc`).mockResolvedValue(false);

    expect(await testForNpmConfig({projectRoot})).toBe(false);
  });
});
