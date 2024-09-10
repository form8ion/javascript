import {info} from '@travi/cli-messages';
import {writePackageJson} from '@form8ion/javascript-core';

import buildPackageDetails from './details.js';

export default async function ({
  projectRoot,
  dialect,
  packageName,
  license,
  author,
  description
}) {
  info('Configuring package.json');

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

  return {};
}
