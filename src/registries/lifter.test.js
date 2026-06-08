import {loadNpmrc, writeNpmrc} from '@form8ion/javascript-core';

import any from '@travi/any';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';

import buildAllowedHostsList from '../lockfile-lint/allowed-hosts-builder.js';
import {
  scaffold as scaffoldLockfileLint,
  test as lockfileLintIsAlreadyConfigured,
  read as readLockfileLintConfig,
  write as writeLockfileLintConfig
} from '../lockfile-lint/index.js';
import buildRegistriesConfig from './npm-config/list-builder.js';
import liftRegistries from './lifter.js';

vi.mock('@form8ion/javascript-core');
vi.mock('../lockfile-lint/allowed-hosts-builder.js');
vi.mock('../lockfile-lint/index.js');
vi.mock('../registries/npm-config/list-builder.js');

describe('registries lifter', () => {
  const projectRoot = any.string();
  const packageManager = any.word();
  const registries = any.simpleObject();
  const configs = {...any.simpleObject(), registries};
  const processedRegistryDetails = any.simpleObject();
  const existingNpmConfig = any.simpleObject();

  beforeEach(() => {
    when(loadNpmrc).calledWith({projectRoot}).thenResolve(existingNpmConfig);
    when(buildRegistriesConfig).calledWith(registries).thenReturn(processedRegistryDetails);
  });

  it('should define the registries in the npmrc and lockfile-lint configs', async () => {
    const existingLockfileLintConfig = any.simpleObject();
    const allowedHosts = any.listOf(any.url);
    when(lockfileLintIsAlreadyConfigured).calledWith({projectRoot}).thenResolve(true);
    when(readLockfileLintConfig).calledWith({projectRoot}).thenResolve(existingLockfileLintConfig);
    when(buildAllowedHostsList).calledWith({packageManager, registries}).thenReturn(allowedHosts);

    expect(await liftRegistries({projectRoot, packageManager, configs})).toEqual({});

    expect(writeNpmrc).toHaveBeenCalledWith({
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
    when(lockfileLintIsAlreadyConfigured).calledWith({projectRoot}).thenResolve(false);
    when(scaffoldLockfileLint)
      .calledWith({projectRoot, packageManager, registries})
      .thenResolve(lockfileLintResults);

    expect(await liftRegistries({projectRoot, packageManager, configs}))
      .toEqual(lockfileLintResults);
  });
});
