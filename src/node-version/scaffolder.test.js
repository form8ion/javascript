import {promises as fs} from 'node:fs';

import {vi, it, expect, describe, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {determineLatestVersionOf, install as installNodeVersion} from './tasks.js';
import {scaffold as scaffoldNodeVersion} from './index.js';

vi.mock('node:fs');
vi.mock('./tasks.js');

describe('node-version scaffolder', () => {
  const projectRoot = any.string();
  const logger = {info: () => undefined};

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should configure nvm with the desired version', async () => {
    const nodeVersionCategory = any.word();
    const version = any.word();
    when(determineLatestVersionOf).calledWith(nodeVersionCategory, {logger}).thenResolve(version);

    expect(await scaffoldNodeVersion({projectRoot, nodeVersionCategory}, {logger})).toEqual(version);
    expect(installNodeVersion).toHaveBeenCalledWith(nodeVersionCategory, {logger});
    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/.nvmrc`, version);
  });

  it('should return `undefined` when a category is not defined', async () => {
    expect(await scaffoldNodeVersion({projectRoot}, {logger})).toBe(undefined);
  });
});
