import {fileTypes} from '@form8ion/core';
import {packageManagers} from '@form8ion/javascript-core';
import {write} from '@form8ion/config-file';

import buildAllowedHostsList from './allowed-hosts-builder.js';
import {defineLockfilePath as determineLockfilePathFor} from '../package-managers/index.js';

const lockfileLintSupportedPackageManagers = [packageManagers.NPM, packageManagers.YARN];

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

  await write({
    name: 'lockfile-lint',
    format: fileTypes.JSON,
    path: projectRoot,
    config: {
      path: determineLockfilePathFor(packageManager),
      type: packageManager,
      'validate-https': true,
      'allowed-hosts': buildAllowedHostsList({packageManager, registries})
    }
  });

  return {
    devDependencies: ['lockfile-lint'],
    scripts: {'lint:lockfile': 'lockfile-lint'}
  };
}
