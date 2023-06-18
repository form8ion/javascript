import {mergeIntoExistingPackageJson, projectTypes} from '@form8ion/javascript-core';
import * as rollupScaffolder from '@form8ion/rollup';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as defineBadges from '../publishable/badges';
import scaffoldCli from './scaffolder';

vi.mock('@form8ion/javascript-core');
vi.mock('@form8ion/rollup');
vi.mock('../publishable/badges');

describe('cli project-type scaffolder', () => {
  const projectRoot = any.string();
  const packageName = any.word();
  const badges = any.simpleObject();
  const configs = any.simpleObject();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the cli project-type details', async () => {
    const visibility = 'Private';
    const rollupResults = any.simpleObject();
    const dialect = any.word();
    when(rollupScaffolder.scaffold)
      .calledWith({projectRoot, dialect, projectType: projectTypes.CLI})
      .mockResolvedValue(rollupResults);
    when(defineBadges.default).calledWith(packageName, visibility).mockReturnValue(badges);

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
  });

  it('should publish the package publicly when the visibility is `Public`', async () => {
    await scaffoldCli({projectRoot, configs, packageName, visibility: 'Public'});

    expect(mergeIntoExistingPackageJson)
      .toHaveBeenCalledWith({projectRoot, config: {bin: {}, files: ['bin/'], publishConfig: {access: 'public'}}});
  });

  it('should define the registry to publish to when provided', async () => {
    const publishRegistry = any.url();

    await scaffoldCli({
      projectRoot,
      configs,
      packageName,
      visibility: 'Public',
      publishRegistry
    });

    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        bin: {},
        files: ['bin/'],
        publishConfig: {
          access: 'public',
          registry: publishRegistry
        }
      }
    });
  });
});
