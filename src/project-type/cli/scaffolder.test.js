import {mergeIntoExistingPackageJson, projectTypes} from '@form8ion/javascript-core';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import determinePackageAccessLevelFromProjectVisibility from '../publishable/access-level.js';
import {scaffold as scaffoldBundler} from '../publishable/bundler/index.js';
import {scaffold as scaffoldPublishable} from '../publishable/index.js';
import scaffoldCli from './scaffolder.js';

vi.mock('@form8ion/javascript-core');
vi.mock('../publishable/access-level');
vi.mock('../publishable/bundler');
vi.mock('../publishable');

describe('cli project-type scaffolder', () => {
  const projectRoot = any.string();
  const packageName = any.word();
  const publishableResults = any.simpleObject();
  const configs = any.simpleObject();
  const visibility = any.word();
  const packageAccessLevel = any.word();
  const bundlerResults = any.simpleObject();
  const dialect = any.word();
  const decisions = any.simpleObject();
  const packageBundlers = any.simpleObject();

  beforeEach(() => {
    when(determinePackageAccessLevelFromProjectVisibility)
      .calledWith({projectVisibility: visibility})
      .mockReturnValue(packageAccessLevel);
    when(scaffoldPublishable).calledWith({packageName, packageAccessLevel}).mockReturnValue(publishableResults);
    when(scaffoldBundler)
      .calledWith({bundlers: packageBundlers, decisions, projectRoot, dialect, projectType: projectTypes.CLI})
      .mockResolvedValue(bundlerResults);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the cli project-type details', async () => {
    const results = await scaffoldCli({
      projectRoot,
      configs,
      packageName,
      visibility,
      dialect,
      decisions,
      packageBundlers
    });

    expect(results).toEqual({
      ...publishableResults,
      ...bundlerResults,
      scripts: {
        clean: 'rimraf ./bin',
        prebuild: 'run-s clean',
        build: 'npm-run-all --print-label --parallel build:*',
        prepack: 'run-s build'
      },
      dependencies: ['update-notifier'],
      devDependencies: ['rimraf'],
      vcsIgnore: {
        files: [],
        directories: ['/bin/']
      },
      buildDirectory: 'bin',
      nextSteps: [{summary: 'Define supported node.js versions as `engines.node` in the `package.json` file'}]
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {bin: {}, files: ['bin/'], publishConfig: {access: packageAccessLevel}}
    });
  });

  it('should define the registry to publish to when provided', async () => {
    const publishRegistry = any.url();

    await scaffoldCli({
      projectRoot,
      configs,
      packageName,
      visibility,
      publishRegistry,
      dialect,
      decisions,
      packageBundlers
    });

    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        bin: {},
        files: ['bin/'],
        publishConfig: {
          access: packageAccessLevel,
          registry: publishRegistry
        }
      }
    });
  });
});
