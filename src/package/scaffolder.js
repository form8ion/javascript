import {info} from '@travi/cli-messages';

import {write} from './config-file';
import buildPackageDetails from './details';

export default async function ({
  projectRoot,
  projectType,
  dialect,
  packageName,
  license,
  vcs,
  author,
  description,
  packageProperties,
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
    packageProperties,
    pathWithinParent
  });

  await write({projectRoot, config: packageData});

  return {homepage: packageData.homepage};
}
