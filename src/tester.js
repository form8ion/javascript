import {info} from '@travi/cli-messages';

import {test as nvmIsUsed} from './node-version/index.js';
import {test as jsPackageManagerIsUsed} from './package-managers/index.js';

export default async function ({projectRoot}) {
  const [nvmFound, jsPackageManagerFound] = await Promise.all([
    nvmIsUsed({projectRoot}),
    jsPackageManagerIsUsed({projectRoot})
  ]);

  const jsProjectFound = nvmFound || jsPackageManagerFound;

  if (jsProjectFound) info('JavaScript Project Detected');

  return jsProjectFound;
}
