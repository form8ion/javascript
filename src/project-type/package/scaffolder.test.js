import {dialects, mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as defineBadges from '../publishable/badges';
import * as buildDetails from './build-details';
import * as documentationScaffolder from './documentation';
import scaffoldPackage from './scaffolder';

vi.mock('@form8ion/javascript-core');
vi.mock('../publishable/badges');
vi.mock('./build-details');
vi.mock('./documentation');

describe('package project-type scaffolder', () => {
  const projectRoot = any.string();
  const packageBundlers = any.simpleObject();
  const projectName = any.word();
  const packageName = any.word();
  const packageManager = any.word();
  const visibility = 'Private';
  const scope = any.word();
  const provideExample = any.boolean();
  const badges = {consumer: any.simpleObject(), contribution: any.simpleObject(), status: any.simpleObject()};
  const commonNextSteps = [
    {summary: 'Add the appropriate `save` flag to the installation instructions in the README'},
    {summary: 'Publish pre-release versions to npm until package is stable enough to publish v1.0.0'}
  ];
  const documentation = any.simpleObject();
  const decisions = any.simpleObject();
  const buildDetailsResults = any.simpleObject();

  beforeEach(() => {
    when(documentationScaffolder.default)
      .calledWith({scope, packageName, visibility, packageManager, provideExample})
      .mockReturnValue(documentation);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold details specific to a modern-js package', async () => {
    const dialect = dialects.BABEL;
    when(defineBadges.default).calledWith(packageName, visibility).mockReturnValue(badges);
    when(buildDetails.default).calledWith({
      projectRoot,
      projectName,
      packageBundlers,
      visibility,
      packageName,
      dialect,
      provideExample,
      decisions
    }).mockResolvedValue(buildDetailsResults);

    expect(await scaffoldPackage({
      projectRoot,
      projectName,
      packageName,
      packageManager,
      visibility,
      scope,
      packageBundlers,
      decisions,
      dialect,
      provideExample
    })).toEqual({
      ...buildDetailsResults,
      badges,
      documentation,
      nextSteps: commonNextSteps
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        sideEffects: false,
        main: './lib/index.js',
        module: './lib/index.mjs',
        exports: {
          module: './lib/index.mjs',
          require: './lib/index.js',
          import: './lib/index.mjs'
        },
        files: ['example.js', 'lib/'],
        publishConfig: {access: 'restricted'}
      }
    });
  });

  it('should scaffold details specific to an esm-only package', async () => {
    const dialect = dialects.ESM;
    when(defineBadges.default).calledWith(packageName, visibility).mockReturnValue(badges);
    when(buildDetails.default).calledWith({
      projectRoot,
      projectName,
      packageBundlers,
      visibility,
      packageName,
      dialect,
      provideExample,
      decisions
    }).mockResolvedValue(buildDetailsResults);

    expect(await scaffoldPackage({
      projectRoot,
      projectName,
      packageName,
      visibility,
      dialect,
      scope,
      packageManager,
      packageBundlers,
      decisions,
      provideExample
    })).toEqual({
      ...buildDetailsResults,
      badges,
      documentation,
      nextSteps: commonNextSteps
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        main: './lib/index.mjs',
        exports: './lib/index.mjs',
        files: ['example.js', 'lib/'],
        sideEffects: false,
        publishConfig: {access: 'restricted'}
      }
    });
  });

  it('should scaffold details specific to a typescript package', async () => {
    const dialect = dialects.TYPESCRIPT;
    when(defineBadges.default).calledWith(packageName, visibility).mockReturnValue(badges);
    when(buildDetails.default).calledWith({
      projectRoot,
      projectName,
      packageBundlers,
      visibility,
      packageName,
      dialect,
      provideExample,
      decisions
    }).mockResolvedValue(buildDetailsResults);

    expect(await scaffoldPackage({
      projectRoot,
      projectName,
      packageName,
      packageManager,
      visibility,
      scope,
      packageBundlers,
      decisions,
      dialect,
      provideExample
    })).toEqual({
      ...buildDetailsResults,
      badges,
      documentation,
      nextSteps: commonNextSteps
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        sideEffects: false,
        main: './lib/index.js',
        module: './lib/index.mjs',
        types: './lib/index.d.ts',
        exports: {
          types: './lib/index.d.ts',
          require: './lib/index.js',
          import: './lib/index.mjs'
        },
        files: ['example.js', 'lib/'],
        publishConfig: {access: 'restricted'}
      }
    });
  });

  it('should not include build details when the project will not be scaffolded', async () => {
    const dialect = dialects.COMMON_JS;
    when(defineBadges.default).calledWith(packageName, visibility).mockReturnValue(badges);
    when(buildDetails.default).calledWith({
      projectRoot,
      projectName,
      packageBundlers,
      visibility,
      packageName,
      dialect,
      provideExample,
      decisions
    }).mockResolvedValue(buildDetailsResults);

    expect(await scaffoldPackage({
      projectRoot,
      packageName,
      projectName,
      packageManager,
      visibility,
      scope,
      decisions,
      packageBundlers,
      dialect,
      provideExample
    })).toEqual({
      ...buildDetailsResults,
      badges,
      documentation,
      nextSteps: commonNextSteps
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        files: ['example.js', 'index.js'],
        publishConfig: {access: 'restricted'},
        sideEffects: false
      }
    });
  });

  it('should define the registry to publish to when provided', async () => {
    const publishRegistry = any.url();
    const dialect = dialects.BABEL;
    when(buildDetails.default).calledWith({
      projectRoot,
      projectName,
      packageBundlers,
      visibility,
      packageName,
      dialect,
      provideExample,
      decisions
    }).mockResolvedValue(buildDetailsResults);

    await scaffoldPackage({
      projectRoot,
      packageName,
      projectName,
      packageManager,
      visibility,
      scope,
      decisions,
      publishRegistry,
      dialect,
      provideExample,
      packageBundlers
    });

    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        sideEffects: false,
        main: './lib/index.js',
        module: './lib/index.mjs',
        exports: {
          module: './lib/index.mjs',
          require: './lib/index.js',
          import: './lib/index.mjs'
        },
        files: ['example.js', 'lib/'],
        publishConfig: {
          access: 'restricted',
          registry: publishRegistry
        }
      }
    });
  });
});
