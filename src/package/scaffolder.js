import {info} from '@travi/cli-messages';

import {write} from './config-file';
import buildPackageDetails from './details';

export default async function ({
  projectRoot,
  projectType,
  dialect,
  scripts,
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
    scripts,
    packageProperties,
    pathWithinParent
  });

  await write({projectRoot, config: packageData});

  return {homepage: packageData.homepage};
}
