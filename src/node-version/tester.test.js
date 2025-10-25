import {fileExists} from '@form8ion/core';

import {expect, describe, it, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import npmIsUsed from './tester.js';

vi.mock('@form8ion/core');

describe('nvm predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` is a `.nvmrc` exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.nvmrc`).thenResolve(true);

    expect(await npmIsUsed({projectRoot})).toBe(true);
  });

  it('should return `false` is a `.nvmrc` does not exist', async () => {
    when(fileExists).calledWith(`${projectRoot}/.nvmrc`).thenResolve(false);

    expect(await npmIsUsed({projectRoot})).toBe(false);
  });
});
