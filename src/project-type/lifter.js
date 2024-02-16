import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {test as isPackage, lift as liftPackage} from './package/index.js';
import {test as isCli, lift as liftCli} from './cli/index.js';

function vcsRepositoryHostedOnGithub(vcs) {
  return vcs && 'github' === vcs.host;
}

export default async function ({projectRoot, packageDetails, vcs}) {
  if (await isPackage({projectRoot, packageDetails})) return liftPackage({projectRoot, packageDetails});
  if (await isCli({projectRoot, packageDetails})) return liftCli({projectRoot, packageDetails});

  let homepage;

  if (vcsRepositoryHostedOnGithub(vcs)) {
    homepage = `https://github.com/${vcs.owner}/${vcs.name}#readme`;

    await mergeIntoExistingPackageJson({projectRoot, config: {homepage}});
  }

  return {homepage};
}
