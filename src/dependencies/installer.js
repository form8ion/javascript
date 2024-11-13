import {info, warn} from '@travi/cli-messages';
import {DEV_DEPENDENCY_TYPE, packageManagers} from '@form8ion/javascript-core';

import {execa} from 'execa';
import {getDependencyTypeFlag, getExactFlag, getInstallationCommandFor} from './package-managers.js';

export default async function (dependencies, dependenciesType, projectRoot, packageManager = packageManagers.NPM) {
  if (dependencies.length) {
    info(`Installing ${dependenciesType} dependencies`, {level: 'secondary'});

    await execa(
      `. ~/.nvm/nvm.sh && nvm use && ${packageManager} ${
        getInstallationCommandFor(packageManager)
      } ${[...new Set(dependencies)].join(' ')} --${getDependencyTypeFlag(packageManager, dependenciesType)}${
        DEV_DEPENDENCY_TYPE === dependenciesType ? ` --${getExactFlag(packageManager)}` : ''
      }`,
      {shell: true, cwd: projectRoot}
    );
  } else warn(`No ${dependenciesType} dependencies to install`);
}
