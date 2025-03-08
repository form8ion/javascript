import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import enhanceSlsa from './slsa.js';

export default async function ({projectRoot, packageDetails}) {
  const {publishConfig: {access} = {}} = packageDetails;

  if ('public' === access) {
    await mergeIntoExistingPackageJson({projectRoot, config: {publishConfig: {provenance: true}}});

    return enhanceSlsa({provenance: true});
  }

  return {};
}
