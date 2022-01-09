import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {lift as liftEslint} from '@form8ion/eslint';
import * as huskyPlugin from '@form8ion/husky';

import * as coveragePlugin from '../coverage';
import applyEnhancers from './enhancers/apply';
import * as enginesEnhancer from './enhancers/engines';
import liftPackage from './package';
import resolvePackageManager from './package-manager';

export default async function ({projectRoot, vcs, results}) {
  info('Lifting JavaScript-specific details');

  const {scripts, tags, eslintConfigs, dependencies, devDependencies, packageManager: manager} = results;

  const packageManager = await resolvePackageManager({projectRoot, packageManager: manager});

  const eslintResults = await liftEslint({projectRoot, configs: eslintConfigs});
  const enhancerResults = await applyEnhancers({
    results,
    enhancers: [huskyPlugin, enginesEnhancer, coveragePlugin],
    options: {packageManager, projectRoot, vcs}
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
