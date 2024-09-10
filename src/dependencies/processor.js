import {info} from '@travi/cli-messages';
import {DEV_DEPENDENCY_TYPE, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

import install from './installer.js';

export default async function ({dependencies, devDependencies, projectRoot, packageManager}) {
  info('Processing dependencies');

  await install(dependencies || [], PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
  await install(devDependencies || [], DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
}
