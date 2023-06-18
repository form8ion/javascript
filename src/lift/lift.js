import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {applyEnhancers} from '@form8ion/core';
import * as huskyPlugin from '@form8ion/husky';
import * as commitConventionPlugin from '@form8ion/commit-convention';

import * as coveragePlugin from '../coverage';
import * as codeStylePlugin from '../code-style';
import * as enginesEnhancer from './enhancers/engines';
import * as projectTypes from '../project-type';
import * as dialects from '../dialects';
import {lift as liftPackage} from '../package';
import resolvePackageManager from './package-manager';

export default async function ({projectRoot, vcs, results}) {
  info('Lifting JavaScript-specific details');

  const {
    scripts,
    tags,
    dependencies,
    devDependencies,
    packageManager: manager
  } = results;

  const packageManager = await resolvePackageManager({projectRoot, packageManager: manager});

  const enhancerResults = await applyEnhancers({
    results,
    enhancers: [
      huskyPlugin,
      enginesEnhancer,
      coveragePlugin,
      commitConventionPlugin,
      dialects,
      codeStylePlugin,
      projectTypes
    ],
    options: {packageManager, projectRoot, vcs}
  });

  await liftPackage(
    deepmerge.all([
      {projectRoot, scripts, tags, dependencies, devDependencies, packageManager},
      enhancerResults
    ])
  );

  return enhancerResults;
}
