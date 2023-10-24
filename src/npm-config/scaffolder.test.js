import {promises as fs} from 'node:fs';
import {projectTypes} from '@form8ion/javascript-core';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';

import scaffoldNpmConfig from './scaffolder.js';

vi.mock('node:fs');

describe('npm config scaffolder', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should save exact versions of dependencies for applications', async () => {
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.APPLICATION, registries: {}});

    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/.npmrc`,
      'update-notifier=false\nsave-exact=true\n'
    );
  });

  it('should save exact versions of dependencies for cli applications', async () => {
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.CLI, registries: {}});

    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/.npmrc`,
      'update-notifier=false\nsave-exact=true\n'
    );
  });

  it('should allow semver ranges for dependencies of packages', async () => {
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.PACKAGE, registries: {}});

    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/.npmrc`,
      'update-notifier=false\n'
    );
  });

  it('should define a registry override when provided', async () => {
    const registries = {registry: any.url()};

    await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries});

    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/.npmrc`,
      `update-notifier=false\nregistry=${registries.registry}\n`
    );
  });

  it('should not define a publish registry when provided', async () => {
    const registries = {registry: any.url(), publish: any.url()};

    await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries});

    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/.npmrc`,
      `update-notifier=false\nregistry=${registries.registry}\n`
    );
  });

  it('should add scoped registries when provided', async () => {
    const registries = any.objectWithKeys(any.listOf(any.word), {factory: any.word});

    await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries});

    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/.npmrc`,
      `update-notifier=false\n${
        Object.entries(registries)
          .map(([scope, url]) => `@${scope}:registry=${url}`)
          .join('\n')
      }\n`
    );
  });

  it('should define the script to enforce peer-dependency compatibility', async () => {
    const results = await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries: {}});

    expect(results.scripts['lint:peer']).toEqual('npm ls >/dev/null');
  });
});
