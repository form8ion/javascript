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
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.APPLICATION});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      config: {
        'update-notifier': false,
        'save-exact': true
      }
    });
  });

  it('should save exact versions of dependencies for cli applications', async () => {
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.CLI});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      config: {
        'update-notifier': false,
        'save-exact': true
      }
    });
  });

  it('should allow semver ranges for dependencies of packages', async () => {
    await scaffoldNpmConfig({projectRoot, projectType: projectTypes.PACKAGE});

    expect(write).toHaveBeenCalledWith({projectRoot, config: {'update-notifier': false}});
  });

  it('should define the script to enforce peer-dependency compatibility', async () => {
    const results = await scaffoldNpmConfig({projectRoot, projectType: any.word(), registries: {}});

    expect(results.scripts['lint:peer']).toEqual('npm ls >/dev/null');
  });
});
