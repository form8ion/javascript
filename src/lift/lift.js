import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {applyEnhancers} from '@form8ion/core';
import {lift as liftEslint} from '@form8ion/eslint';
import * as huskyPlugin from '@form8ion/husky';
import * as commitConventionPlugin from '@form8ion/commit-convention';

import * as coveragePlugin from '../coverage';
import * as enginesEnhancer from './enhancers/engines';
import * as dialects from '../dialects';
import {lift as liftPackage} from '../package';
import resolvePackageManager from './package-manager';

export default async function ({projectRoot, vcs, results}) {
  info('Lifting JavaScript-specific details');

  const {
    scripts,
    tags,
    eslintConfigs,
    eslint,
    dependencies,
    devDependencies,
    packageManager: manager,
    buildDirectory
  } = results;

  const packageManager = await resolvePackageManager({projectRoot, packageManager: manager});

  const eslintResults = await liftEslint({projectRoot, configs: [...eslintConfigs || [], ...eslint?.configs || []]});
  const enhancerResults = await applyEnhancers({
    results,
    enhancers: [huskyPlugin, enginesEnhancer, coveragePlugin, commitConventionPlugin, dialects],
    options: {packageManager, projectRoot, vcs, buildDirectory}
  });

  await liftPackage(
    deepmerge.all([
      {projectRoot, scripts, tags, dependencies, devDependencies, packageManager},
      enhancerResults,
      eslintResults
    ])
  );

  return enhancerResults;
}
