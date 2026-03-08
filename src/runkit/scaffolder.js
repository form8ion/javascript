import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {scaffold as scaffoldBadge} from './badge/index.js';

export default async function scaffoldRunkit({projectRoot, packageName, visibility}) {
  if ('Public' !== visibility) return {};

  await mergeIntoExistingPackageJson({projectRoot, config: {runkitExampleFilename: './example.js'}});

  return scaffoldBadge({packageName});
}
