import {test as isPackage} from './package';
import {test as isCli} from './cli';

export default async function ({projectRoot, packageDetails}) {
  return await isPackage({projectRoot, packageDetails}) || isCli({projectRoot, packageDetails});
}
