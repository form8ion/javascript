import {test as isPackage, lift as liftPackage} from './package/index.js';
import {test as isCli, lift as liftCli} from './cli/index.js';

export default async function ({projectRoot, packageDetails}) {
  if (await isPackage({projectRoot, packageDetails})) return liftPackage({projectRoot, packageDetails});
  if (await isCli({projectRoot, packageDetails})) return liftCli({projectRoot, packageDetails});

  return {};
}
