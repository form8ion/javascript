import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import defineBadges from './badges.js';
import {lift as liftProvenance} from './provenance/index.js';

export default async function liftPublishable({projectRoot, packageDetails}) {
  const {name: packageName, publishConfig: {access: packageAccessLevel}} = packageDetails;
  const homepage = `https://npm.im/${packageName}`;

  await mergeIntoExistingPackageJson({projectRoot, config: {homepage}});

  return deepmerge(
    await liftProvenance({packageDetails, projectRoot}),
    {
      homepage,
      dependencies: {javascript: {development: ['publint']}},
      scripts: {'lint:publish': 'publint --strict'},
      badges: defineBadges(packageName, packageAccessLevel)
    }
  );
}
