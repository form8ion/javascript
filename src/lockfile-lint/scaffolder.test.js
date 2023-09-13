import {fileTypes} from '@form8ion/core';
import {packageManagers} from '@form8ion/javascript-core';
import {write as writeConfigFile} from '@form8ion/config-file';

import {afterEach, vi, expect, it, describe} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import buildAllowedHosts from './allowed-hosts-builder';
import scaffoldLockfileLint from './scaffolder';

vi.mock('@form8ion/config-file');
vi.mock('./allowed-hosts-builder');

const lockfileLintSupportedPackageManagers = [packageManagers.NPM, packageManagers.YARN];

describe('lockfile linting scaffolder', () => {
  const projectRoot = any.string();
  const registries = any.simpleObject();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be configured properly for npm', async () => {
    const allowedHosts = any.listOf(any.url);
    when(buildAllowedHosts).calledWith({packageManager: packageManagers.NPM, registries}).mockReturnValue(allowedHosts);

    const {devDependencies, scripts} = await scaffoldLockfileLint({
      projectRoot,
      packageManager: packageManagers.NPM,
      registries
    });

    expect(writeConfigFile).toHaveBeenCalledWith({
      name: 'lockfile-lint',
      format: fileTypes.JSON,
      path: projectRoot,
      config: {
        path: 'package-lock.json',
        type: packageManagers.NPM,
        'validate-https': true,
        'allowed-hosts': allowedHosts
      }
    });
    expect(devDependencies).toEqual(['lockfile-lint']);
    expect(scripts['lint:lockfile']).toEqual('lockfile-lint');
  });

  it('should be configured properly for yarn', async () => {
    const allowedHosts = any.listOf(any.url);
    when(buildAllowedHosts)
      .calledWith({packageManager: packageManagers.YARN, registries})
      .mockReturnValue(allowedHosts);

    const {devDependencies, scripts} = await scaffoldLockfileLint({
      projectRoot,
      packageManager: packageManagers.YARN,
      registries
    });

    expect(writeConfigFile).toHaveBeenCalledWith({
      name: 'lockfile-lint',
      format: fileTypes.JSON,
      path: projectRoot,
      config: {
        path: 'yarn.lock',
        type: packageManagers.YARN,
        'validate-https': true,
        'allowed-hosts': allowedHosts
      }
    });
    expect(devDependencies).toEqual(['lockfile-lint']);
    expect(scripts['lint:lockfile']).toEqual('lockfile-lint');
  });

  it('should throw an error for unsupported package managers', async () => {
    const packageManager = any.word();

    expect(scaffoldLockfileLint({projectRoot, packageManager})).rejects.toThrowError(
      `The ${packageManager} package manager is currently not supported by lockfile-lint. `
      + `Only ${lockfileLintSupportedPackageManagers.join(' and ')} are currently supported.`
    );
  });
});
