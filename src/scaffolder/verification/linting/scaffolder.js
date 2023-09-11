import deepmerge from 'deepmerge';
import scaffoldBanSensitiveFiles from './ban-sensitive-files';
import {scaffold as scaffoldLockfileLint} from '../../../lockfile-lint';

export default async function ({projectRoot, packageManager, registries, vcs, pathWithinParent}) {
  return deepmerge.all(await Promise.all([
    scaffoldLockfileLint({projectRoot, packageManager, registries}),
    vcs ? scaffoldBanSensitiveFiles({pathWithinParent}) : {}
  ]));
}
