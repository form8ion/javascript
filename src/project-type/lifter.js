import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {test as isPackage, lift as liftPackage} from './package/index.js';
import {test as isCli, lift as liftCli} from './cli/index.js';

function vcsRepositoryHostedOnGithub(vcs) {
  return vcs && 'github' === vcs.host;
}

export default async function liftProjectType({projectRoot, packageDetails, vcs, configs, results}) {
  if (await isPackage({projectRoot, packageDetails})) {
    return liftPackage({projectRoot, packageDetails, configs, npmRegistry: results.npmRegistry});
  }

  if (await isCli({projectRoot, packageDetails})) {
    return liftCli({projectRoot, packageDetails, configs, npmRegistry: results.npmRegistry});
  }

  let homepage;

  if (vcsRepositoryHostedOnGithub(vcs)) {
    homepage = `https://github.com/${vcs.owner}/${vcs.name}#readme`;

    await mergeIntoExistingPackageJson({projectRoot, config: {homepage}});
  }

  return {homepage};
}
