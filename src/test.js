import {fileExists} from '@form8ion/core';

export default async function ({projectRoot}) {
  const [nvmIsConfigured, packageLockExists, yarnLockExists] = await Promise.all([
    fileExists(`${projectRoot}/.nvmrc`),
    fileExists(`${projectRoot}/package-lock.json`),
    fileExists(`${projectRoot}/yarn.lock`)
  ]);

  return nvmIsConfigured || packageLockExists || yarnLockExists;
}
