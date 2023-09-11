import deepmerge from 'deepmerge';
import {scaffold as scaffoldHusky} from '@form8ion/husky';

import scaffoldTesting from './testing';
import {scaffold as scaffoldLinting} from '../../linting';

export async function scaffoldVerification({
  projectRoot,
  dialect,
  visibility,
  packageManager,
  vcs,
  registries,
  tests,
  unitTestFrameworks,
  decisions,
  pathWithinParent
}) {
  const [testingResults, lintingResults, huskyResults] = await Promise.all([
    scaffoldTesting({
      projectRoot,
      tests,
      visibility,
      vcs,
      unitTestFrameworks,
      decisions,
      dialect,
      pathWithinParent
    }),
    scaffoldLinting({projectRoot, packageManager, registries, vcs, pathWithinParent}),
    scaffoldHusky({projectRoot, packageManager, pathWithinParent})
  ]);

  return deepmerge.all([testingResults, lintingResults, huskyResults]);
}
