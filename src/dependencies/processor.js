import {error, info} from '@travi/cli-messages';
import {DEV_DEPENDENCY_TYPE, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

import install from './installer.js';

export default async function ({dependencies = {}, projectRoot, packageManager}) {
  info('Processing dependencies');

  if (Array.isArray(dependencies)) {
    throw new Error(`Expected dependencies to be an object. Instead received: ${dependencies}`);
  }

  const {javascript: {production = [], development = []} = {}} = dependencies;

  try {
    await install(production, PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    await install(development, DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
  } catch (e) {
    error('Failed to update dependencies');
    error(e, {level: 'secondary'});
  }
}
