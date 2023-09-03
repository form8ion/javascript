import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson, projectTypes} from '@form8ion/javascript-core';
import {scaffold as scaffoldRollup} from '@form8ion/rollup';

import determinePackageAccessLevelFromProjectVisibility from '../publishable/access-level';
import {scaffold as scaffoldPublishable} from '../publishable';

const defaultBuildDirectory = 'bin';

export default async function ({packageName, visibility, projectRoot, dialect, publishRegistry}) {
  const packageAccessLevel = determinePackageAccessLevelFromProjectVisibility({projectVisibility: visibility});
  const [rollupResults, publishableResults] = await Promise.all([
    scaffoldRollup({projectRoot, dialect, projectType: projectTypes.CLI}),
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
    rollupResults,
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
      nextSteps: []
    }
  ]);
}
