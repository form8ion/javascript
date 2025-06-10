import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {dialects, mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import scaffoldPackageDocumentation from './documentation.js';
import determinePackageAccessLevelFromProjectVisibility from '../publishable/access-level.js';
import {scaffold as scaffoldPublishable} from '../publishable/index.js';
import buildDetails from './build-details.js';

export default async function ({
  projectRoot,
  projectName,
  packageName,
  packageManager,
  visibility,
  scope,
  packageBundlers,
  decisions,
  dialect,
  provideExample,
  publishRegistry
}) {
  info('Scaffolding Package Details');

  const packageAccessLevel = determinePackageAccessLevelFromProjectVisibility({projectVisibility: visibility});
  const [detailsForBuild, publishableResults] = await Promise.all([
    buildDetails({
      projectRoot,
      projectName,
      packageBundlers,
      visibility,
      packageName,
      dialect,
      provideExample,
      decisions
    }),
    scaffoldPublishable({packageName, packageAccessLevel}),
    mergeIntoExistingPackageJson({
      projectRoot,
      config: {
        files: ['example.js', ...dialects.COMMON_JS === dialect ? ['index.js'] : ['lib/', 'src/']],
        publishConfig: {
          access: packageAccessLevel,
          ...publishRegistry && {registry: publishRegistry}
        },
        sideEffects: false,
        ...'Public' === visibility && {runkitExampleFilename: './example.js'},
        ...dialects.BABEL === dialect && {
          main: './lib/index.js',
          module: './lib/index.mjs',
          exports: {
            module: './lib/index.mjs',
            require: './lib/index.js',
            import: './lib/index.mjs'
          }
        },
        ...dialects.ESM === dialect && {
          main: './lib/index.js',
          exports: './lib/index.js'
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

  return deepmerge.all([
    publishableResults,
    {
      documentation: scaffoldPackageDocumentation({packageName, visibility, scope, packageManager, provideExample}),
      nextSteps: [
        {summary: 'Add the appropriate `save` flag to the installation instructions in the README'},
        {summary: 'Define supported node.js versions as `engines.node` in the `package.json` file'},
        {summary: 'Publish pre-release versions to npm until package is stable enough to publish v1.0.0'}
      ]
    },
    detailsForBuild
  ]);
}
