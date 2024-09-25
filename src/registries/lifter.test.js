import any from '@travi/any';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import buildAllowedHostsList from '../lockfile-lint/allowed-hosts-builder.js';
import {
  scaffold as scaffoldLockfileLint,
  test as lockfileLintIsAlreadyConfigured,
  read as readLockfileLintConfig,
  write as writeLockfileLintConfig
} from '../lockfile-lint/index.js';
import {read as readNpmConfig, write as writeNpmConfig} from '../npm-config/index.js';
import buildRegistriesConfig from './npm-config/list-builder.js';
import liftRegistries from './lifter.js';

vi.mock('../lockfile-lint/allowed-hosts-builder.js');
vi.mock('../lockfile-lint/index.js');
vi.mock('../registries/npm-config/list-builder.js');
vi.mock('../npm-config/index.js');

describe('registries lifter', () => {
  const projectRoot = any.string();
  const packageManager = any.word();
  const registries = any.simpleObject();
  const configs = {...any.simpleObject(), registries};
  const processedRegistryDetails = any.simpleObject();
  const existingNpmConfig = any.simpleObject();

  beforeEach(() => {
    when(readNpmConfig).calledWith({projectRoot}).mockResolvedValue(existingNpmConfig);
    when(buildRegistriesConfig).calledWith(registries).mockReturnValue(processedRegistryDetails);
  });

  it('should define the registries in the npmrc and lockfile-lint configs', async () => {
    const existingLockfileLintConfig = any.simpleObject();
    const allowedHosts = any.listOf(any.url);
    when(lockfileLintIsAlreadyConfigured).calledWith({projectRoot}).mockResolvedValue(true);
    when(readLockfileLintConfig).calledWith({projectRoot}).mockResolvedValue(existingLockfileLintConfig);
    when(buildAllowedHostsList).calledWith({packageManager, registries}).mockReturnValue(allowedHosts);

    expect(await liftRegistries({projectRoot, packageManager, configs})).toEqual({});

    expect(writeNpmConfig).toHaveBeenCalledWith({
      projectRoot,
      config: {...existingNpmConfig, ...processedRegistryDetails}
    });
    expect(writeLockfileLintConfig).toHaveBeenCalledWith({
      projectRoot,
      config: {...existingLockfileLintConfig, 'allowed-hosts': allowedHosts}
    });
  });

  it('should scaffold lockfile-lint if not already present', async () => {
    const lockfileLintResults = any.simpleObject();
    when(lockfileLintIsAlreadyConfigured).calledWith({projectRoot}).mockResolvedValue(false);
    when(scaffoldLockfileLint)
      .calledWith({projectRoot, packageManager, registries})
      .mockResolvedValue(lockfileLintResults);

    expect(await liftRegistries({projectRoot, packageManager, configs}))
      .toEqual(lockfileLintResults);
  });
});
