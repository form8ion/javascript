import {fileExists} from '@form8ion/core';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import nycIsConfigured from './tester.js';

vi.mock('@form8ion/core');

describe('nyc predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` if the config file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.nycrc`).thenResolve(true);

    expect(await nycIsConfigured({projectRoot})).toBe(true);
  });

  it('should return `false` if the config file does not exist', async () => {
    when(fileExists).calledWith(`${projectRoot}/.nycrc`).thenResolve(false);

    expect(await nycIsConfigured({projectRoot})).toBe(false);
  });
});
