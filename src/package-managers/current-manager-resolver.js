import {promises as fs} from 'node:fs';
import {packageManagers} from '@form8ion/javascript-core';

import {test as npmIsUsed} from './npm/index.js';
import {test as yarnIsUsed} from './yarn/index.js';

export default async function ({projectRoot, packageManager}) {
  if (packageManager) return packageManager;

  const {packageManager: pinnedPackageManager} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));

  if (await npmIsUsed({projectRoot, pinnedPackageManager})) {
    return packageManagers.NPM;
  }

  if (await yarnIsUsed({projectRoot, pinnedPackageManager})) {
    return packageManagers.YARN;
  }

  throw new Error('Package-manager could not be determined');
}
