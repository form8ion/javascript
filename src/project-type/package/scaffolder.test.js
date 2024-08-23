import {dialects, mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import determinePackageAccessLevelFromProjectVisibility from '../publishable/access-level.js';
import {scaffold as scaffoldPublishable} from '../publishable/index.js';
import * as buildDetails from './build-details.js';
import * as documentationScaffolder from './documentation.js';
import scaffoldPackage from './scaffolder.js';

vi.mock('@form8ion/javascript-core');
vi.mock('../publishable/access-level.js');
vi.mock('../publishable/index.js');
vi.mock('./build-details.js');
vi.mock('./documentation.js');

describe('package project-type scaffolder', () => {
  const projectRoot = any.string();
  const packageBundlers = any.simpleObject();
  const projectName = any.word();
  const packageName = any.word();
  const packageManager = any.word();
  const visibility = any.word();
  const packageAccessLevel = any.word();
  const scope = any.word();
  const provideExample = any.boolean();
  const publishableResults = any.simpleObject();
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
    when(determinePackageAccessLevelFromProjectVisibility)
      .calledWith({projectVisibility: visibility})
      .mockReturnValue(packageAccessLevel);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold details specific to a modern-js package', async () => {
    const dialect = dialects.BABEL;
    when(scaffoldPublishable).calledWith({packageName, packageAccessLevel}).mockReturnValue(publishableResults);
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
      ...publishableResults,
      ...buildDetailsResults,
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
        publishConfig: {access: packageAccessLevel}
      }
    });
  });

  it('should scaffold details specific to an esm-only package', async () => {
    const dialect = dialects.ESM;
    when(scaffoldPublishable).calledWith({packageName, visibility}).mockReturnValue(publishableResults);
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
      ...publishableResults,
      ...buildDetailsResults,
      documentation,
      nextSteps: commonNextSteps
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        main: './lib/index.js',
        exports: './lib/index.js',
        files: ['example.js', 'lib/'],
        sideEffects: false,
        publishConfig: {access: packageAccessLevel}
      }
    });
  });

  it('should scaffold details specific to a typescript package', async () => {
    const dialect = dialects.TYPESCRIPT;
    when(scaffoldPublishable).calledWith({packageName, visibility}).mockReturnValue(publishableResults);
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
      ...publishableResults,
      ...buildDetailsResults,
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
        publishConfig: {access: packageAccessLevel}
      }
    });
  });

  it('should not include build details when the project will not be scaffolded', async () => {
    const dialect = dialects.COMMON_JS;
    when(scaffoldPublishable).calledWith({packageName, visibility}).mockReturnValue(publishableResults);
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
      ...publishableResults,
      ...buildDetailsResults,
      documentation,
      nextSteps: commonNextSteps
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {
        files: ['example.js', 'index.js'],
        publishConfig: {access: packageAccessLevel},
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
          access: packageAccessLevel,
          registry: publishRegistry
        }
      }
    });
  });
});
