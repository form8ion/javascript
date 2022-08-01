import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';
import {info} from '@travi/cli-messages';

const defaultBuildDirectory = 'public';

export default async function ({projectRoot}) {
  info('Scaffolding Application Details');

  await mergeIntoExistingPackageJson({projectRoot, config: {private: true}});

  const buildDirectory = defaultBuildDirectory;

  return {
    scripts: {
      clean: `rimraf ./${buildDirectory}`,
      start: `node ./${buildDirectory}/index.js`,
      prebuild: 'run-s clean'
    },
    dependencies: [],
    devDependencies: ['rimraf'],
    vcsIgnore: {files: ['.env'], directories: [`/${buildDirectory}/`]},
    buildDirectory,
    nextSteps: []
  };
}
