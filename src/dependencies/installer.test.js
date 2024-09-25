import {DEV_DEPENDENCY_TYPE, packageManagers} from '@form8ion/javascript-core';

import {vi, it, describe, expect, beforeEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import execa from '../../thirdparty-wrappers/execa.js';
import {getDependencyTypeFlag, getInstallationCommandFor, getExactFlag} from './package-managers.js';
import install from './installer.js';

vi.mock('../../thirdparty-wrappers/execa.js');
vi.mock('./package-managers.js');

describe('dependencies installer', () => {
  const projectRoot = any.string();
  const packageManager = any.word();
  const installationCommand = any.string();
  const typeFlag = any.word();
  const duplicateDependency = any.word();
  const uniqueDependencies = any.listOf(any.word);
  const dependencies = [duplicateDependency, ...uniqueDependencies, duplicateDependency];
  const exactFlag = any.word();

  beforeEach(() => {
    when(getInstallationCommandFor).calledWith(packageManager).mockReturnValue(installationCommand);
  });

  it('should avoid execution when there are no dependencies to install', async () => {
    await install([]);

    expect(execa).not.toHaveBeenCalled();
  });

  it('should install dependencies', async () => {
    const dependenciesType = any.word();
    when(getDependencyTypeFlag).calledWith(packageManager, dependenciesType).mockReturnValue(typeFlag);

    await install(dependencies, dependenciesType, projectRoot, packageManager);

    expect(execa).toHaveBeenCalledWith(
      `. ~/.nvm/nvm.sh && nvm use && ${packageManager} ${installationCommand} ${
        [duplicateDependency, ...uniqueDependencies].join(' ')
      } --${typeFlag}`,
      {shell: true, cwd: projectRoot}
    );
  });

  it('should pin versions when installing dev-dependencies', async () => {
    await install(dependencies, DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
    when(getDependencyTypeFlag).calledWith(packageManager, DEV_DEPENDENCY_TYPE).mockReturnValue(typeFlag);
    when(getExactFlag).calledWith(packageManager).mockReturnValue(exactFlag);

    await install(dependencies, DEV_DEPENDENCY_TYPE, projectRoot, packageManager);

    expect(execa).toHaveBeenCalledWith(
      `. ~/.nvm/nvm.sh && nvm use && ${packageManager} ${installationCommand} ${
        [duplicateDependency, ...uniqueDependencies].join(' ')
      } --${typeFlag} --${exactFlag}`,
      {shell: true, cwd: projectRoot}
    );
  });

  it('should default to `npm` when the package-manager is not specified', async () => {
    when(getDependencyTypeFlag).calledWith(packageManagers.NPM, DEV_DEPENDENCY_TYPE).mockReturnValue(typeFlag);
    when(getExactFlag).calledWith(packageManagers.NPM).mockReturnValue(exactFlag);
    when(getInstallationCommandFor).calledWith(packageManagers.NPM).mockReturnValue(installationCommand);

    await install(dependencies, DEV_DEPENDENCY_TYPE, projectRoot);

    expect(execa).toHaveBeenCalledWith(
      `. ~/.nvm/nvm.sh && nvm use && ${packageManagers.NPM} ${installationCommand} ${
        [duplicateDependency, ...uniqueDependencies].join(' ')
      } --${typeFlag} --${exactFlag}`,
      {shell: true, cwd: projectRoot}
    );
  });
});
