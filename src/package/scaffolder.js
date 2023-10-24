import {info} from '@travi/cli-messages';
import {writePackageJson} from '@form8ion/javascript-core';

import buildPackageDetails from './details.js';

export default async function ({
  projectRoot,
  projectType,
  dialect,
  packageName,
  license,
  vcs,
  author,
  description,
  pathWithinParent
}) {
  info('Configuring package.json');

  const packageData = await buildPackageDetails({
    packageName,
    projectType,
    dialect,
    license,
    vcs,
    author,
    description,
    pathWithinParent
  });

  await writePackageJson({projectRoot, config: packageData});

  return {homepage: packageData.homepage};
}
