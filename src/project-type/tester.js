import {test as isPackage} from './package';
import {test as isCli} from './cli';

export default async function ({projectRoot}) {
  return await isPackage({projectRoot}) || isCli({projectRoot});
}
