import {info} from '@travi/cli-messages';
import {writePackageJson} from '@form8ion/javascript-core';

import buildPackageName from './package-name.js';
import buildPackageDetails from './details.js';

export default async function ({
  projectRoot,
  projectName,
  scope,
  dialect,
  license,
  author,
  description
}) {
  info('Configuring package.json');

  const packageName = buildPackageName(projectName, scope);

  await writePackageJson({
    projectRoot,
    config: await buildPackageDetails({
      packageName,
      dialect,
      license,
      author,
      description
    })
  });

  return {packageName};
}
