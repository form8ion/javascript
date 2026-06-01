import {test as nvmIsUsed} from './node-version/index.js';
import {test as jsPackageManagerIsUsed} from './package-managers/index.js';

export default async function projectUsesJavaScript({projectRoot}, {logger}) {
  const [nvmFound, jsPackageManagerFound] = await Promise.all([
    nvmIsUsed({projectRoot}),
    jsPackageManagerIsUsed({projectRoot})
  ]);

  const jsProjectFound = nvmFound || jsPackageManagerFound;

  if (jsProjectFound) logger.info('JavaScript Project Detected');

  return jsProjectFound;
}
