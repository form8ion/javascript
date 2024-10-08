import {fileExists} from '@form8ion/core';

import {expect, describe, vi, it} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import babelExists from './predicate.js';

vi.mock('@form8ion/core');

describe('babel predicate', () => {
  const projectRoot = any.string();

  it('should return `true` when a babel config exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.babelrc.json`).mockResolvedValue(true);

    expect(await babelExists({projectRoot})).toBe(true);
  });

  it('should return `false` when a babel config exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.babelrc.json`).mockResolvedValue(false);

    expect(await babelExists({projectRoot})).toBe(false);
  });
});
