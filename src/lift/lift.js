import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {lift as liftEslint} from '@form8ion/eslint';

import * as coveragePlugin from '../coverage';
import applyEnhancers from './enhancers/apply';
import * as enginesEnhancer from './enhancers/engines';
import {enhanceHuskyEnhancer} from './enhancers/enhanced-enhancers';
import liftPackage from './package';
import resolvePackageManager from './package-manager';

export default async function ({projectRoot, results}) {
  info('Lifting JavaScript-specific details');

  const {scripts, tags, eslintConfigs, dependencies, devDependencies, packageManager: manager} = results;

  const packageManager = await resolvePackageManager({projectRoot, packageManager: manager});

  const eslintResults = await liftEslint({projectRoot, configs: eslintConfigs});
  const enhancerResults = await applyEnhancers({
    results,
    enhancers: [enhanceHuskyEnhancer(packageManager), enginesEnhancer, coveragePlugin],
    projectRoot
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
