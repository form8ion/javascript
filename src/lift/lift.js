import {promises as fs} from 'node:fs';
import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {applyEnhancers} from '@form8ion/core';
import * as huskyPlugin from '@form8ion/husky';
import * as commitConventionPlugin from '@form8ion/commit-convention';

import * as coveragePlugin from '../coverage/index.js';
import * as codeStylePlugin from '../code-style/index.js';
import * as npmConfigPlugin from '../npm-config/index.js';
import * as enginesEnhancer from './enhancers/engines.js';
import * as projectTypes from '../project-type/index.js';
import * as dialects from '../dialects/index.js';
import {lift as liftPackage} from '../package/index.js';
import {determineCurrent as resolvePackageManager} from '../package-managers/index.js';

export default async function ({projectRoot, vcs, results, pathWithinParent}) {
  info('Lifting JavaScript-specific details');

  const {
    scripts,
    tags,
    dependencies,
    devDependencies,
    packageManager: manager
  } = results;

  const [packageManager, packageContents] = await Promise.all([
    resolvePackageManager({projectRoot, packageManager: manager}),
    fs.readFile(`${projectRoot}/package.json`, 'utf8')
  ]);

  const enhancerResults = await applyEnhancers({
    results,
    enhancers: [
      huskyPlugin,
      enginesEnhancer,
      coveragePlugin,
      commitConventionPlugin,
      dialects,
      codeStylePlugin,
      npmConfigPlugin,
      projectTypes
    ],
    options: {packageManager, projectRoot, vcs, packageDetails: JSON.parse(packageContents)}
  });

  await liftPackage(
    deepmerge.all([
      {projectRoot, scripts, tags, dependencies, devDependencies, packageManager, vcs, pathWithinParent},
      enhancerResults
    ])
  );

  return enhancerResults;
}
