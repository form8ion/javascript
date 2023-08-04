import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import enhanceSlsa from './slsa';

export default async function ({projectRoot, packageDetails}) {
  await mergeIntoExistingPackageJson({projectRoot, config: {publishConfig: {provenance: true}}});

  return deepmerge(
    enhanceSlsa({packageDetails}),
    {devDependencies: ['publint'], scripts: {'lint:publish': 'publint --strict'}}
  );
}
