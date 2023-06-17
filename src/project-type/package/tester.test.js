import {promises as fs} from 'node:fs';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import test from './tester';

vi.mock('node:fs');

describe('package project-type tester', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` if the project defines `exports`', async () => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify({...any.simpleObject(), exports: any.word()}));

    expect(await test({projectRoot})).toBe(true);
  });

  it('should return `true` if the project defines `publishConfig`', async () => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify({...any.simpleObject(), publishConfig: any.simpleObject()}));

    expect(await test({projectRoot})).toBe(true);
  });

  it('should return `false` if the project defines `bin` in addition to `publishConfig`', async () => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify({
        ...any.simpleObject(),
        publishConfig: any.simpleObject(),
        bin: any.simpleObject()
      }));

    expect(await test({projectRoot})).toBe(false);
  });

  it('should return `false` when there are no indicators that the project is a package type', async () => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(any.simpleObject()));

    expect(await test({projectRoot})).toBe(false);
  });
});
