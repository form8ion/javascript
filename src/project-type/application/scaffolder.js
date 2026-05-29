import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

const defaultBuildDirectory = 'public';

export default async function scaffoldApplication({projectRoot}, {logger}) {
  logger.info('Scaffolding Application Details');

  await mergeIntoExistingPackageJson({projectRoot, config: {private: true}});

  const buildDirectory = defaultBuildDirectory;

  return {
    scripts: {
      clean: `rimraf ./${buildDirectory}`,
      start: `node ./${buildDirectory}/index.js`,
      prebuild: 'run-s clean'
    },
    dependencies: {javascript: {development: ['rimraf']}},
    vcsIgnore: {files: ['.env'], directories: [`/${buildDirectory}/`]},
    buildDirectory,
    nextSteps: []
  };
}
