import {fileExists} from '@form8ion/core';

import {expect, describe, it, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import npmIsUsed from './tester.js';

vi.mock('@form8ion/core');

describe('npm predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` is a `package-lock.json` exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/package-lock.json`).mockResolvedValue(true);

    expect(await npmIsUsed({projectRoot})).toBe(true);
  });

  it('should return `false` is a `package-lock.json` does not exist', async () => {
    when(fileExists).calledWith(`${projectRoot}/package-lock.json`).mockResolvedValue(false);

    expect(await npmIsUsed({projectRoot})).toBe(false);
  });
});
