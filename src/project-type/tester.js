import {test as isPackage} from './package/index.js';
import {test as isCli} from './cli/index.js';
import {test as isApplication} from './application/index.js';

export default async function ({projectRoot, packageDetails}) {
  return await isPackage({projectRoot, packageDetails})
    || await isCli({projectRoot, packageDetails})
    || isApplication({projectRoot, packageDetails});
}
