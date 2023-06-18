import {test as isPackage, lift as liftPackage} from './package';
import {test as isCli, lift as liftCli} from './cli';

export default async function ({projectRoot}) {
  if (await isPackage({projectRoot})) return liftPackage({projectRoot});
  if (await isCli({projectRoot})) return liftCli({projectRoot});

  return {};
}
