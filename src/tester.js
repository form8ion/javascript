import {test as nvmIsUsed} from './node-version/index.js';
import {test as npmIsUsed} from './package-managers/npm/index.js';
import {test as yarnIsUsed} from './package-managers/yarn/index.js';

export default async function ({projectRoot}) {
  const [nvmIsConfigured, packageLockExists, yarnLockExists] = await Promise.all([
    nvmIsUsed({projectRoot}),
    npmIsUsed({projectRoot}),
    yarnIsUsed({projectRoot})
  ]);

  return nvmIsConfigured || packageLockExists || yarnLockExists;
}
