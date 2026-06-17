import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import resolveRegistry from './registry-resolver.js';
import {lift as liftProvenance} from './provenance/index.js';

export default async function liftPublishable({projectRoot, packageDetails, configs, npmRegistry}) {
  const {name: packageName} = packageDetails;
  const customRegistry = resolveRegistry(packageName, configs.registries);
  const registryPage = npmRegistry?.packageDetailsPage || `https://www.npmjs.com/package/${packageName}`;

  await mergeIntoExistingPackageJson({projectRoot, config: {homepage: registryPage}});

  return deepmerge(
    await liftProvenance({packageDetails, projectRoot, customRegistry}),
    {
      homepage: registryPage,
      dependencies: {javascript: {development: ['publint']}},
      scripts: {'lint:publish': 'publint --strict'}
    }
  );
}
