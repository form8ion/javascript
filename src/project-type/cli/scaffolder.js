import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson, projectTypes} from '@form8ion/javascript-core';

import determinePackageAccessLevelFromProjectVisibility from '../publishable/access-level.js';
import {scaffold as scaffoldPublishable} from '../publishable/index.js';
import {scaffold as scaffoldBundler} from '../publishable/bundler/index.js';

const defaultBuildDirectory = 'bin';

export default async function scaffoldCli({
  visibility,
  projectRoot,
  dialect,
  publishRegistry,
  packageBundlers
}, dependencies) {
  const packageAccessLevel = determinePackageAccessLevelFromProjectVisibility({projectVisibility: visibility});
  const [bundlerResults, publishableResults] = await Promise.all([
    scaffoldBundler({bundlers: packageBundlers, projectRoot, dialect, projectType: projectTypes.CLI}, dependencies),
    scaffoldPublishable(),
    mergeIntoExistingPackageJson({
      projectRoot,
      config: {
        bin: {},
        files: [`${defaultBuildDirectory}/`, 'src/'],
        publishConfig: {
          access: packageAccessLevel,
          ...publishRegistry && {registry: publishRegistry}
        }
      }
    })
  ]);

  return deepmerge.all([
    publishableResults,
    bundlerResults,
    {
      scripts: {
        clean: `rimraf ./${defaultBuildDirectory}`,
        prebuild: 'run-s clean',
        build: 'npm-run-all --print-label --parallel build:*',
        prepack: 'run-s build'
      },
      dependencies: {javascript: {production: ['update-notifier'], development: ['rimraf']}},
      vcsIgnore: {files: [], directories: [`/${defaultBuildDirectory}/`]},
      buildDirectory: defaultBuildDirectory,
      nextSteps: [{summary: 'Define supported node.js versions as `engines.node` in the `package.json` file'}]
    }
  ]);
}
