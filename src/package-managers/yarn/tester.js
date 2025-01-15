import {fileExists} from '@form8ion/core';
import {packageManagers} from '@form8ion/javascript-core';

import determineLockfilePath from '../lockfile-path-resolver.js';

export default function ({projectRoot, pinnedPackageManager = ''}) {
  const [packageManager] = pinnedPackageManager.split('@');

  return packageManagers.YARN === packageManager
    || fileExists(`${projectRoot}/${determineLockfilePath(packageManagers.YARN)}`);
}
