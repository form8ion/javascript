import deepmerge from 'deepmerge';

import scaffoldBanSensitiveFiles from './ban-sensitive-files.js';
import {scaffold as scaffoldLockfileLint} from '../lockfile-lint/index.js';

export default async function ({projectRoot, packageManager, registries, vcs, pathWithinParent}) {
  return deepmerge.all(await Promise.all([
    scaffoldLockfileLint({projectRoot, packageManager, registries}),
    vcs ? scaffoldBanSensitiveFiles({pathWithinParent}) : {}
  ]));
}
