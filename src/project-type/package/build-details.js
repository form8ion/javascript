import {promises as fs} from 'fs';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import mkdir from 'make-dir';
import touch from 'touch';
import camelcase from 'camelcase';
import {dialects, projectTypes} from '@form8ion/javascript-core';

import {scaffold as scaffoldBundler} from '../publishable/bundler/index.js';
import determinePathToTemplateFile from '../../template-path.js';

const defaultBuildDirectory = 'lib';

async function createExample(projectRoot, projectName, dialect) {
  return fs.writeFile(
    `${projectRoot}/example.js`,
    mustache.render(
      await fs.readFile(determinePathToTemplateFile('example.mustache'), 'utf8'),
      {projectName: camelcase(projectName), esm: dialect === dialects.ESM}
    )
  );
}

async function buildDetailsForCommonJsProject({projectRoot, projectName, provideExample}) {
  await Promise.all([
    touch(`${projectRoot}/index.js`),
    provideExample
      ? fs.writeFile(`${projectRoot}/example.js`, `const ${camelcase(projectName)} = require('.');\n`)
      : Promise.resolve()
  ]);

  return {};
}

export default async function ({
  projectRoot,
  projectName,
  visibility,
  packageName,
  packageBundlers,
  dialect,
  provideExample,
  decisions
}) {
  if (dialects.COMMON_JS === dialect) return buildDetailsForCommonJsProject({projectRoot, projectName, provideExample});

  const pathToCreatedSrcDirectory = await mkdir(`${projectRoot}/src`);
  const [bundlerResults] = await Promise.all([
    scaffoldBundler({bundlers: packageBundlers, projectRoot, dialect, decisions, projectType: projectTypes.PACKAGE}),
    provideExample ? await createExample(projectRoot, projectName, dialect) : Promise.resolve,
    touch(`${pathToCreatedSrcDirectory}/index.js`)
  ]);

  return deepmerge(
    bundlerResults,
    {
      devDependencies: ['rimraf'],
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
