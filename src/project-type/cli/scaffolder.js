import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson, projectTypes} from '@form8ion/javascript-core';

import determinePackageAccessLevelFromProjectVisibility from '../publishable/access-level.js';
import {scaffold as scaffoldPublishable} from '../publishable/index.js';
import {scaffold as scaffoldBundler} from '../publishable/bundler/index.js';

const defaultBuildDirectory = 'bin';

export default async function ({
  packageName,
  visibility,
  projectRoot,
  dialect,
  publishRegistry,
  decisions,
  packageBundlers
}) {
  const packageAccessLevel = determinePackageAccessLevelFromProjectVisibility({projectVisibility: visibility});
  const [bundlerResults, publishableResults] = await Promise.all([
    scaffoldBundler({bundlers: packageBundlers, projectRoot, dialect, decisions, projectType: projectTypes.CLI}),
    scaffoldPublishable({packageName, packageAccessLevel}),
    mergeIntoExistingPackageJson({
      projectRoot,
      config: {
        bin: {},
        files: [`${defaultBuildDirectory}/`],
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
      dependencies: ['update-notifier'],
      devDependencies: ['rimraf'],
      vcsIgnore: {files: [], directories: [`/${defaultBuildDirectory}/`]},
      buildDirectory: defaultBuildDirectory,
      nextSteps: [{summary: 'Define supported node.js versions as `engines.node` in the `package.json` file'}]
    }
  ]);
}
