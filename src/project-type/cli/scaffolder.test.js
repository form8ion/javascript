import {mergeIntoExistingPackageJson, projectTypes} from '@form8ion/javascript-core';
import * as rollupScaffolder from '@form8ion/rollup';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import defineBadges from '../publishable/badges';
import determinePackageAccessLevelFromProjectVisibility from '../publishable/access-level';
import scaffoldCli from './scaffolder';

vi.mock('@form8ion/javascript-core');
vi.mock('@form8ion/rollup');
vi.mock('../publishable/badges');
vi.mock('../publishable/access-level');

describe('cli project-type scaffolder', () => {
  const projectRoot = any.string();
  const packageName = any.word();
  const badges = any.simpleObject();
  const configs = any.simpleObject();
  const visibility = any.word();
  const packageAccessLevel = any.word();

  beforeEach(() => {
    when(determinePackageAccessLevelFromProjectVisibility)
      .calledWith({projectVisibility: visibility})
      .mockReturnValue(packageAccessLevel);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the cli project-type details', async () => {
    const rollupResults = any.simpleObject();
    const dialect = any.word();
    when(rollupScaffolder.scaffold)
      .calledWith({projectRoot, dialect, projectType: projectTypes.CLI})
      .mockResolvedValue(rollupResults);
    when(defineBadges).calledWith(packageName, packageAccessLevel).mockReturnValue(badges);

    expect(await scaffoldCli({projectRoot, configs, packageName, visibility, dialect})).toEqual({
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
      badges,
      nextSteps: []
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {bin: {}, files: ['bin/'], publishConfig: {access: packageAccessLevel}}
    });
  });

  it('should define the registry to publish to when provided', async () => {
    const publishRegistry = any.url();

    await scaffoldCli({projectRoot, configs, packageName, visibility, publishRegistry});

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
