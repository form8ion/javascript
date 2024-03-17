import {packageManagers} from '@form8ion/javascript-core';

import {test as npmIsUsed} from './npm/index.js';
import {test as yarnIsUsed} from './yarn/index.js';

export default async function ({projectRoot, packageManager}) {
  if (packageManager) return packageManager;

  if (await npmIsUsed({projectRoot})) {
    return packageManagers.NPM;
  }

  if (await yarnIsUsed({projectRoot})) {
    return packageManagers.YARN;
  }

  throw new Error('Package-manager could not be determined');
}
