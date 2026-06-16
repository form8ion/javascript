import {lift as liftPublishable} from '../publishable/index.js';

export default function liftPackage({projectRoot, packageDetails, configs, npmRegistry}) {
  return liftPublishable({projectRoot, packageDetails, configs, npmRegistry});
}
