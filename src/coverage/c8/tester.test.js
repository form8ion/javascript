import {fileExists} from '@form8ion/core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import c8IsConfigured from './tester.js';

vi.mock('@form8ion/core');

describe('c8 predicate', () => {
  const projectRoot = any.string();

  it('should return `true` if the config file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.c8rc.json`).mockResolvedValue(true);

    expect(await c8IsConfigured({projectRoot})).toBe(true);
  });

  it('should return `false` if the config file does not exist', async () => {
    when(fileExists).calledWith(`${projectRoot}/.c8rc.json`).mockResolvedValue(false);

    expect(await c8IsConfigured({projectRoot})).toBe(false);
  });
});
