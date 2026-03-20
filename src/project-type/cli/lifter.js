import {lift as liftPublishable} from '../publishable/index.js';

export default function liftCli({projectRoot, packageDetails, registry}) {
  return liftPublishable({projectRoot, packageDetails, registry});
}
