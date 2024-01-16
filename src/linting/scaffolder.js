import {scaffold as scaffoldLockfileLint} from '../lockfile-lint/index.js';

export default async function ({projectRoot, packageManager, registries}) {
  return scaffoldLockfileLint({projectRoot, packageManager, registries});
}
