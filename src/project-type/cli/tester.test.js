import {promises as fs} from 'node:fs';

import {afterEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import test from './tester';

vi.mock('node:fs');

describe('cli project-type tester', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` when the project defines `bin`', async () => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify({...any.simpleObject(), bin: any.simpleObject()}));

    expect(await test({projectRoot})).toBe(true);
  });

  it('should return `false` when the project does not define `bin`', async () => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(any.simpleObject()));

    expect(await test({projectRoot})).toBe(false);
  });
});
