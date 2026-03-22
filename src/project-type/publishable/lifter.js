import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import resolveRegistry from './registry-resolver.js';
import defineBadges from './badges.js';
import {lift as liftProvenance} from './provenance/index.js';

export default async function liftPublishable({projectRoot, packageDetails, configs}) {
  const {name: packageName, publishConfig: {access: packageAccessLevel}} = packageDetails;
  const homepage = `https://npm.im/${packageName}`;
  const customRegistry = resolveRegistry(packageName, configs.registries);

  await mergeIntoExistingPackageJson({projectRoot, config: {homepage}});

  return deepmerge(
    await liftProvenance({packageDetails, projectRoot, customRegistry}),
    {
      homepage,
      dependencies: {javascript: {development: ['publint']}},
      scripts: {'lint:publish': 'publint --strict'},
      badges: defineBadges({packageName, accessLevel: packageAccessLevel, customRegistry})
    }
  );
}
