import {lift as liftPublishable} from '../publishable/index.js';

export default function liftPackage({projectRoot, packageDetails}) {
  return liftPublishable({projectRoot, packageDetails});
}
