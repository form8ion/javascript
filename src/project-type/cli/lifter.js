import {lift as liftPublishable} from '../publishable/index.js';

export default function liftCli({projectRoot, packageDetails, configs, npmRegistry}) {
  return liftPublishable({projectRoot, packageDetails, configs, npmRegistry});
}
