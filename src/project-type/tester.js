import {test as isPackage} from './package';

export default function ({projectRoot}) {
  return isPackage({projectRoot});
}
