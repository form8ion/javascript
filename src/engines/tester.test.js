import {promises as fs} from 'node:fs';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import testEngines from './tester.js';

vi.mock('node:fs');

describe('engines tester', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` when `engines.node` is defined', async () => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf8')
      .thenResolve(JSON.stringify({engines: {node: any.word()}}));

    expect(await testEngines({projectRoot})).toBe(true);
  });

  it('should return `false` when `engines.node` is not defined', async () => {
    when(fs.readFile).calledWith(`${projectRoot}/package.json`, 'utf8').thenReturn(JSON.stringify({engines: {}}));

    expect(await testEngines({projectRoot})).toBe(false);
  });

  it('should return `false` when `engines` is not defined', async () => {
    when(fs.readFile).calledWith(`${projectRoot}/package.json`, 'utf8').thenReturn(JSON.stringify({}));

    expect(await testEngines({projectRoot})).toBe(false);
  });
});
