import {lift as liftPublishable} from '../publishable/index.js';

export default function liftCli({projectRoot, packageDetails}) {
  return liftPublishable({projectRoot, packageDetails});
}
