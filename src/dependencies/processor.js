import {error, info} from '@travi/cli-messages';
import {DEV_DEPENDENCY_TYPE, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

import install from './installer.js';

export default async function ({dependencies: {production = [], development = []} = {}, projectRoot, packageManager}) {
  info('Processing dependencies');

  try {
    await install(production, PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    await install(development, DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
  } catch (e) {
    error('Failed to update dependencies');
    error(e, {level: 'secondary'});
  }
}
