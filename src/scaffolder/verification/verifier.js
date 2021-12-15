import deepmerge from 'deepmerge';
import {scaffold as scaffoldHusky} from '@form8ion/husky';

import scaffoldTesting from './testing';
import scaffoldLinting from './linting';

export async function scaffoldVerification({
  projectRoot,
  projectType,
  dialect,
  visibility,
  packageManager,
  vcs,
  configs,
  registries,
  configureLinting,
  tests,
  unitTestFrameworks,
  decisions,
  buildDirectory,
  eslintConfigs,
  pathWithinParent
}) {
  const [testingResults, huskyResults] = await Promise.all([
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
    scaffoldHusky({projectRoot, packageManager})
  ]);

  const lintingResults = await scaffoldLinting({
    projectRoot,
    projectType,
    packageManager,
    dialect,
    configs,
    registries,
    vcs,
    configureLinting,
    buildDirectory,
    eslint: deepmerge.all([testingResults.eslint, {configs: testingResults.eslintConfigs}, {configs: eslintConfigs}])
  });

  return deepmerge.all([testingResults, lintingResults, huskyResults]);
}
