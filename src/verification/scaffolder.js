import deepmerge from 'deepmerge';
import {scaffold as scaffoldHusky} from '@form8ion/husky';

import {scaffold as scaffoldTesting} from '../testing/index.js';
import {scaffold as scaffoldLinting} from '../linting/index.js';

export async function scaffoldVerification({
  projectRoot,
  dialect,
  packageManager,
  vcs,
  registries,
  tests,
  unitTestFrameworks,
  integrationTestFrameworks,
  decisions,
  pathWithinParent
}) {
  const [testingResults, lintingResults, huskyResults] = await Promise.all([
    scaffoldTesting({projectRoot, tests, unitTestFrameworks, integrationTestFrameworks, decisions, dialect}),
    scaffoldLinting({projectRoot, packageManager, registries, vcs, pathWithinParent}),
    scaffoldHusky({projectRoot, packageManager, pathWithinParent})
  ]);

  return deepmerge.all([testingResults, lintingResults, huskyResults]);
}
