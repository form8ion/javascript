import {packageManagers} from '@form8ion/javascript-core';

export default function (packageManager) {
  const lockfilePaths = {
    [packageManagers.NPM]: 'package-lock.json',
    [packageManagers.YARN]: 'yarn.lock'
  };

  return lockfilePaths[packageManager];
}
