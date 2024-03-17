import {promises as fs} from 'node:fs';
import deepmerge from 'deepmerge';
import * as core from '@form8ion/core';
import * as huskyPlugin from '@form8ion/husky';
import * as commitConventionPlugin from '@form8ion/commit-convention';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as coveragePlugin from '../coverage/index.js';
import * as codeStylePlugin from '../code-style/index.js';
import * as npmConfigPlugin from '../npm-config/index.js';
import * as enginesEnhancer from './enhancers/engines.js';
import * as projectTypes from '../project-type/index.js';
import * as dialects from '../dialects/index.js';
import * as packageLifter from '../package/lifter.js';
import {determineCurrent as packageManagerResolver} from '../package-managers/index.js';
import lift from './lift.js';

vi.mock('node:fs');
vi.mock('@form8ion/core');
vi.mock('../package/lifter');
vi.mock('../package-managers/index.js');

describe('lift', () => {
  const projectRoot = any.string();
  const scripts = any.simpleObject();
  const tags = any.listOf(any.word);
  const dependencies = any.listOf(any.word);
  const devDependencies = any.listOf(any.word);
  const packageManager = any.word();
  const manager = any.word();
  const enhancerResults = any.simpleObject();
  const vcsDetails = any.simpleObject();
  const results = {...any.simpleObject(), scripts, tags, dependencies, devDependencies, packageManager: manager};

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift results that are specific to js projects', async () => {
    const packageDetails = any.simpleObject();
    const pathWithinParent = any.string();
    when(packageManagerResolver)
      .calledWith({projectRoot, packageManager: manager})
      .mockResolvedValue(packageManager);
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf8')
      .mockResolvedValue(JSON.stringify(packageDetails));
    when(core.applyEnhancers).calledWith({
      results,
      enhancers: [
        huskyPlugin,
        enginesEnhancer,
        coveragePlugin,
        commitConventionPlugin,
        dialects,
        codeStylePlugin,
        npmConfigPlugin,
        projectTypes
      ],
      options: {projectRoot, packageManager, vcs: vcsDetails, packageDetails}
    }).mockResolvedValue(enhancerResults);

    const liftResults = await lift({projectRoot, vcs: vcsDetails, results, pathWithinParent});

    expect(liftResults).toEqual(enhancerResults);
    expect(packageLifter.default).toHaveBeenCalledWith(deepmerge.all([
      {projectRoot, scripts, tags, dependencies, devDependencies, packageManager, vcs: vcsDetails, pathWithinParent},
      enhancerResults
    ]));
  });
});
