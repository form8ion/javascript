import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {
  dialects,
  mergeIntoExistingPackageJson,
  scaffoldChoice as scaffoldChosenPackageType
} from '@form8ion/javascript-core';

import choosePackageType from '../prompt';
import scaffoldPackageDocumentation from './documentation';
import defineBadges from './badges';
import buildDetails from './build-details';

export default async function ({
  projectRoot,
  projectName,
  packageName,
  packageManager,
  visibility,
  scope,
  packageTypes,
  packageBundlers,
  tests,
  decisions,
  dialect,
  publishRegistry
}) {
  info('Scaffolding Package Details');

  const [detailsForBuild] = await Promise.all([
    buildDetails({projectRoot, projectName, packageBundlers, visibility, packageName, dialect, decisions}),
    mergeIntoExistingPackageJson({
      projectRoot,
      config: {
        files: ['example.js', ...dialects.COMMON_JS === dialect ? ['index.js'] : ['lib/']],
        publishConfig: {
          access: 'Public' === visibility ? 'public' : 'restricted',
          ...publishRegistry && {registry: publishRegistry}
        },
        sideEffects: false,
        ...'Public' === visibility && {runkitExampleFilename: './example.js'},
        ...dialects.BABEL === dialect && {
          main: './lib/index.js',
          module: './lib/index.mjs',
          exports: {
            require: './lib/index.js',
            import: './lib/index.mjs'
          }
        },
        ...dialects.ESM === dialect && {
          main: './lib/index.mjs',
          exports: './lib/index.mjs'
        },
        ...dialects.TYPESCRIPT === dialect && {
          main: './lib/index.js',
          module: './lib/index.mjs',
          types: './lib/index.d.ts',
          exports: {
            types: './lib/index.d.ts',
            require: './lib/index.js',
            import: './lib/index.mjs'
          }
        }
      }
    })
  ]);

  const chosenType = await choosePackageType({types: packageTypes, projectType: 'package', decisions});
  const results = await scaffoldChosenPackageType(
    packageTypes,
    chosenType,
    {projectRoot, projectName, packageName, tests, scope}
  );

  return deepmerge.all([
    {
      documentation: scaffoldPackageDocumentation({packageName, visibility, scope, packageManager}),
      eslintConfigs: [],
      nextSteps: [
        {summary: 'Add the appropriate `save` flag to the installation instructions in the README'},
        {summary: 'Publish pre-release versions to npm until package is stable enough to publish v1.0.0'}
      ],
      scripts: {},
      badges: defineBadges(packageName, visibility)
    },
    detailsForBuild,
    results
  ]);
}
