import {promises as fs} from 'node:fs';
import deepmerge from 'deepmerge';
import * as core from '@form8ion/core';
import * as huskyPlugin from '@form8ion/husky';
import * as commitConventionPlugin from '@form8ion/commit-convention';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as coveragePlugin from '../coverage';
import * as codeStylePlugin from '../code-style';
import * as enginesEnhancer from './enhancers/engines';
import * as projectTypes from '../project-type';
import * as dialects from '../dialects';
import * as packageLifter from '../package/lifter';
import * as packageManagerResolver from './package-manager';
import lift from './lift';

vi.mock('node:fs');
vi.mock('@form8ion/core');
vi.mock('../package/lifter');
vi.mock('./package-manager');

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
    when(packageManagerResolver.default)
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
        projectTypes
      ],
      options: {projectRoot, packageManager, vcs: vcsDetails, packageDetails}
    }).mockResolvedValue(enhancerResults);

    const liftResults = await lift({projectRoot, vcs: vcsDetails, results});

    expect(liftResults).toEqual(enhancerResults);
    expect(packageLifter.default).toHaveBeenCalledWith(deepmerge.all([
      {projectRoot, scripts, tags, dependencies, devDependencies, packageManager},
      enhancerResults
    ]));
  });
});
