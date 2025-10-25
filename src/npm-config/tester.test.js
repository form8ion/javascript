import {fileExists} from '@form8ion/core';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import testForNpmConfig from './tester.js';

vi.mock('@form8ion/core');

describe('npm config predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` when an `.npmrc` file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.npmrc`).thenResolve(true);

    expect(await testForNpmConfig({projectRoot})).toBe(true);
  });

  it('should return `false` when an `.npmrc` file does not exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.npmrc`).thenResolve(false);

    expect(await testForNpmConfig({projectRoot})).toBe(false);
  });
});
