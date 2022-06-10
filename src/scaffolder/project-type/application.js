import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson, scaffoldChoice as scaffoldChosenApplicationType} from '@form8ion/javascript-core';
import {info} from '@travi/cli-messages';
import chooseApplicationType from './prompt';

const defaultBuildDirectory = 'lib';

export default async function ({
  applicationTypes,
  projectRoot,
  projectName,
  packageName,
  packageManager,
  tests,
  decisions
}) {
  info('Scaffolding Application Details');

  const [chosenType] = await Promise.all([
    chooseApplicationType({types: applicationTypes, projectType: 'application', decisions}),
    mergeIntoExistingPackageJson({projectRoot, config: {private: true}})
  ]);

  const results = await scaffoldChosenApplicationType(
    applicationTypes,
    chosenType,
    {projectRoot, projectName, packageName, packageManager, tests}
  );

  const buildDirectory = results.buildDirectory || defaultBuildDirectory;

  return deepmerge(
    {
      scripts: {
        clean: `rimraf ./${buildDirectory}`,
        start: `node ./${buildDirectory}/index.js`,
        prebuild: 'run-s clean'
      },
      dependencies: [],
      devDependencies: ['rimraf'],
      vcsIgnore: {files: ['.env'], directories: [`/${buildDirectory}/`]},
      buildDirectory,
      eslintConfigs: [],
      nextSteps: []
    },
    results
  );
}
