import {fileExists} from '@form8ion/core';
import {test as nvmIsUsed} from './node-version/index.js';

export default async function ({projectRoot}) {
  const [nvmIsConfigured, packageLockExists, yarnLockExists] = await Promise.all([
    nvmIsUsed({projectRoot}),
    fileExists(`${projectRoot}/package-lock.json`),
    fileExists(`${projectRoot}/yarn.lock`)
  ]);

  return nvmIsConfigured || packageLockExists || yarnLockExists;
}
