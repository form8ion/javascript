import {promises as fs} from 'fs';
import {packageManagers} from '@form8ion/javascript-core';

import buildAllowedHostsList from './allowed-hosts-builder';

const lockfileLintSupportedPackageManagers = [packageManagers.NPM, packageManagers.YARN];

function determineLockfilePathFor(packageManager) {
  const lockfilePaths = {
    [packageManagers.NPM]: 'package-lock.json',
    [packageManagers.YARN]: 'yarn.lock'
  };

  return lockfilePaths[packageManager];
}

function lockfileLintSupports(packageManager) {
  return lockfileLintSupportedPackageManagers.includes(packageManager);
}

export default async function ({projectRoot, packageManager, registries}) {
  if (!lockfileLintSupports(packageManager)) {
    throw new Error(
      `The ${packageManager} package manager is currently not supported by lockfile-lint. `
      + `Only ${lockfileLintSupportedPackageManagers.join(' and ')} are currently supported.`
    );
  }

  await fs.writeFile(
    `${projectRoot}/.lockfile-lintrc.json`,
    JSON.stringify({
      path: determineLockfilePathFor(packageManager),
      type: packageManager,
      'validate-https': true,
      'allowed-hosts': buildAllowedHostsList({packageManager, registries})
    })
  );

  return {
    devDependencies: ['lockfile-lint'],
    scripts: {'lint:lockfile': 'lockfile-lint'}
  };
}
