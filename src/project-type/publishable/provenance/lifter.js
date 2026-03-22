import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import enhanceSlsa from './slsa.js';

export default async function liftProvenance({projectRoot, packageDetails, customRegistry}) {
  const {publishConfig: {access} = {}} = packageDetails;

  if ('public' === access && !customRegistry) {
    await mergeIntoExistingPackageJson({projectRoot, config: {publishConfig: {provenance: true}}});

    return enhanceSlsa({provenance: true});
  }

  return {};
}
