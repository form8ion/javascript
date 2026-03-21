import {lift as liftPublishable} from '../publishable/index.js';

export default function liftCli({projectRoot, packageDetails, configs}) {
  return liftPublishable({projectRoot, packageDetails, configs});
}
