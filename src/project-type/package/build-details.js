import {promises as fs} from 'fs';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import {dialects, projectTypes, scaffoldChoice as scaffoldChosenBundler} from '@form8ion/javascript-core';

import camelcase from '../../../thirdparty-wrappers/camelcase';
import mkdir from '../../../thirdparty-wrappers/make-dir';
import touch from '../../../thirdparty-wrappers/touch';
import chooseBundler from './prompt';
import determinePathToTemplateFile from '../../template-path';

const defaultBuildDirectory = 'lib';

async function createExample(projectRoot, projectName) {
  return fs.writeFile(
    `${projectRoot}/example.js`,
    mustache.render(
      await fs.readFile(determinePathToTemplateFile('example.mustache'), 'utf8'),
      {projectName: camelcase(projectName)}
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

  const chosenBundler = await chooseBundler({bundlers: packageBundlers, decisions});

  const pathToCreatedSrcDirectory = await mkdir(`${projectRoot}/src`);
  const [bundlerResults] = await Promise.all([
    scaffoldChosenBundler(packageBundlers, chosenBundler, {projectRoot, dialect, projectType: projectTypes.PACKAGE}),
    provideExample ? await createExample(projectRoot, projectName) : Promise.resolve,
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