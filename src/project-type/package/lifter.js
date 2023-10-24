import {lift as liftPublishable} from '../publishable/index.js';

export default function ({projectRoot, packageDetails}) {
  return liftPublishable({projectRoot, packageDetails});
}
