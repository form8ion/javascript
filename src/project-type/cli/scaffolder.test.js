import {mergeIntoExistingPackageJson, projectTypes} from '@form8ion/javascript-core';
import * as rollupScaffolder from '@form8ion/rollup';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import determinePackageAccessLevelFromProjectVisibility from '../publishable/access-level';
import {scaffold as scaffoldPublishable} from '../publishable';
import scaffoldCli from './scaffolder';

vi.mock('@form8ion/javascript-core');
vi.mock('@form8ion/rollup');
vi.mock('../publishable/access-level');
vi.mock('../publishable');

describe('cli project-type scaffolder', () => {
  const projectRoot = any.string();
  const packageName = any.word();
  const publishableResults = any.simpleObject();
  const configs = any.simpleObject();
  const visibility = any.word();
  const packageAccessLevel = any.word();
  const rollupResults = any.simpleObject();
  const dialect = any.word();

  beforeEach(() => {
    when(determinePackageAccessLevelFromProjectVisibility)
      .calledWith({projectVisibility: visibility})
      .mockReturnValue(packageAccessLevel);
    when(scaffoldPublishable).calledWith({packageName, packageAccessLevel}).mockReturnValue(publishableResults);
    when(rollupScaffolder.scaffold)
      .calledWith({projectRoot, dialect, projectType: projectTypes.CLI})
      .mockResolvedValue(rollupResults);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the cli project-type details', async () => {
    expect(await scaffoldCli({projectRoot, configs, packageName, visibility, dialect})).toEqual({
      ...publishableResults,
      ...rollupResults,
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
      nextSteps: []
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {bin: {}, files: ['bin/'], publishConfig: {access: packageAccessLevel}}
    });
  });

  it('should define the registry to publish to when provided', async () => {
    const publishRegistry = any.url();

    await scaffoldCli({projectRoot, configs, packageName, visibility, publishRegistry, dialect});

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
