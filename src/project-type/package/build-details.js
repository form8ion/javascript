import {promises as fs} from 'node:fs';
import deepmerge from 'deepmerge';
import touch from 'touch';
import {dialects, projectTypes} from '@form8ion/javascript-core';

import {scaffold as scaffoldBundler} from '../publishable/bundler/index.js';

const defaultBuildDirectory = 'lib';

async function createExample(projectRoot) {
  return fs.writeFile(`${projectRoot}/example.js`, "import {} from './lib/index.js';\n");
}

async function buildDetailsForCommonJsProject({projectRoot, provideExample}) {
  await Promise.all([
    touch(`${projectRoot}/index.js`),
    provideExample
      ? fs.writeFile(`${projectRoot}/example.js`, "const {} = require('.');\n")
      : Promise.resolve()
  ]);

  return {};
}

export default async function buildDetails({
  projectRoot,
  projectName,
  visibility,
  packageName,
  packageBundlers,
  dialect,
  provideExample,
  decisions
}) {
  if (dialects.COMMON_JS === dialect) return buildDetailsForCommonJsProject({projectRoot, provideExample});

  await fs.mkdir(`${projectRoot}/src`, {recursive: true});
  const [bundlerResults] = await Promise.all([
    scaffoldBundler({bundlers: packageBundlers, projectRoot, dialect, decisions, projectType: projectTypes.PACKAGE}),
    provideExample ? await createExample(projectRoot, projectName, dialect) : Promise.resolve,
    touch(`${projectRoot}/src/index.js`)
  ]);

  return deepmerge(
    bundlerResults,
    {
      dependencies: {javascript: {development: ['rimraf']}},
      scripts: {
        clean: `rimraf ./${defaultBuildDirectory}`,
        prebuild: 'run-s clean',
        build: 'npm-run-all --print-label --parallel build:*',
        prepack: 'run-s build',
        ...provideExample && {'pregenerate:md': 'run-s build'}
      },
      vcsIgnore: {directories: [`/${defaultBuildDirectory}/`]},
      buildDirectory: defaultBuildDirectory,
      badges: {
        consumer: {
          ...'Public' === visibility && {
            runkit: {
              img: `https://badge.runkitcdn.com/${packageName}.svg`,
              text: `Try ${packageName} on RunKit`,
              link: `https://npm.runkit.com/${packageName}`
            }
          }
        }
      }
    }
  );
}
