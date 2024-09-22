import {projectTypes} from '@form8ion/javascript-core';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';

import write from './writer.js';
import scaffoldNpmConfig from './scaffolder.js';

vi.mock('node:fs');
vi.mock('./writer.js');

describe('npm config scaffolder', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should save exact versions of dependencies for applications', async () => {
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.APPLICATION, registries: {}});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      config: {
        registry: 'https://registry.npmjs.org',
        'update-notifier': false,
        'save-exact': true
      }
    });
  });

  it('should save exact versions of dependencies for cli applications', async () => {
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.CLI, registries: {}});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      config: {
        registry: 'https://registry.npmjs.org',
        'update-notifier': false,
        'save-exact': true
      }
    });
  });

  it('should allow semver ranges for dependencies of packages', async () => {
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.PACKAGE, registries: {}});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      config: {
        registry: 'https://registry.npmjs.org',
        'update-notifier': false
      }
    });
  });

  it('should define a registry override when provided', async () => {
    const registries = {registry: any.url()};

    await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      config: {
        'update-notifier': false,
        registry: registries.registry
      }
    });
  });

  it('should not define a publish registry when provided', async () => {
    const registries = {registry: any.url(), publish: any.url()};

    await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      config: {
        'update-notifier': false,
        registry: registries.registry
      }
    });
  });

  it('should add scoped registries when provided', async () => {
    const registries = any.objectWithKeys(any.listOf(any.word), {factory: any.word});

    await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      config: {
        registry: 'https://registry.npmjs.org',
        'update-notifier': false,
        ...Object.fromEntries(
          Object.entries(registries).map(([scope, url]) => ([`@${scope}:registry`, url]))
        )
      }
    });
  });

  it('should define the script to enforce peer-dependency compatibility', async () => {
    const results = await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries: {}});

    expect(results.scripts['lint:peer']).toEqual('npm ls >/dev/null');
  });
});
