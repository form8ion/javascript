import {info} from '@travi/cli-messages';
import {fileTypes, writeConfigFile} from '@form8ion/core';
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

  await writeConfigFile({format: fileTypes.JSON, path: projectRoot, name: 'package', config: packageData});

  return {homepage: packageData.homepage};
}
