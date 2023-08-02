import liftPublishable from '../publishable/lifter';

export default function ({projectRoot, packageDetails}) {
  return liftPublishable({projectRoot, packageDetails});
}
