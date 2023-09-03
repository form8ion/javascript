import {lift as liftPublishable} from '../publishable';

export default function ({projectRoot, packageDetails}) {
  return liftPublishable({projectRoot, packageDetails});
}
