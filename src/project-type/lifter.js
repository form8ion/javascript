import {test as isPackage, lift as liftPackage} from './package';
import {test as isCli, lift as liftCli} from './cli';

export default async function ({projectRoot, packageDetails}) {
  if (await isPackage({projectRoot, packageDetails})) return liftPackage({projectRoot, packageDetails});
  if (await isCli({projectRoot, packageDetails})) return liftCli({projectRoot, packageDetails});

  return {};
}
