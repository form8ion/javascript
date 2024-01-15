import {promises as fs} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DEV_DEPENDENCY_TYPE, projectTypes, writePackageJson} from '@form8ion/javascript-core';

import {After, Before, Given, Then, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import * as td from 'testdouble';
import {assert} from 'chai';

import {
  assertThatNpmConfigDetailsAreConfiguredCorrectlyFor,
  assertThatPackageDetailsAreConfiguredCorrectlyFor
} from './npm-steps.mjs';
import {
  assertThatDocumentationIsDefinedAppropriately,
  assertThatDocumentationResultsAreReturnedCorrectly
} from './documentation-steps.mjs';
import {
  assertThatProperDirectoriesAreIgnoredFromVersionControl,
  assertThatProperFilesAreIgnoredFromVersionControl
} from './vcs-steps.mjs';
import {assertThatProperDirectoriesAreIgnoredFromEslint} from './eslint-steps.mjs';

import validate_npm_package_name from 'validate-npm-package-name';

let scaffold, lift, test, questionNames;
const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToProjectRoot = [__dirname, '..', '..', '..', '..'];
const pathToNodeModules = [...pathToProjectRoot, 'node_modules'];
const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

function escapeSpecialCharacters(string) {
  return string.replace(/[.*+?^$\-{}()|[\]\\]/g, '\\$&');
}

export function assertDevDependencyIsInstalled(execa, dependencyName) {
  td.verify(
    execa(td.matchers.contains(
      new RegExp(`(npm install|yarn add).*${escapeSpecialCharacters(dependencyName)}.*${DEV_DEPENDENCY_TYPE}`)
    )),
    {ignoreExtraArgs: true}
  );
}

Before(async function () {
  validate_npm_package_name(any.word());

  this.execa = await td.replaceEsm('@form8ion/execa-wrapper');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({scaffold, lift, test, questionNames} = await import('@form8ion/javascript'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    templates: {
      'example.mustache': await fs.readFile(resolve(...pathToProjectRoot, 'templates', 'example.mustache'))
    }
  });

  this.configureLinting = true;
  this.provideExample = true,
  this.tested = true;
  this.visibility = any.fromList(['Public', 'Private']);
  this.eslintScope = `@${any.word()}`;
  this.barUnitTestFrameworkEslintConfigs = any.listOf(any.word);
  this.fooMonorepoScripts = any.simpleObject();
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

Given(/^the default answers are chosen$/, async function () {
  this.unitTestAnswer = true;
  this.unitTestFrameworkAnswer = 'foo';
  this.integrationTestAnswer = true;
  this.configureLinting = true;
  this.testFilenamePattern = any.string();
});

Given(/^the project will have "([^"]*)" visibility$/, function (visibility) {
  this.visibility = visibility;
});

When(/^the project is scaffolded$/, async function () {
  const shouldBeScopedAnswer = true;
  this.projectName = `${any.word()}-${any.word()}`;

  try {
    this.scaffoldResult = await scaffold({
      projectRoot: process.cwd(),
      projectName: this.projectName,
      visibility: this.visibility,
      license: any.string(),
      vcs: this.vcs,
      configs: {
        eslint: {scope: this.eslintScope},
        babelPreset: this.babelPreset,
        commitlint: {name: any.word(), packageName: any.word()},
        ...this.typescriptConfig && {typescript: this.typescriptConfig}
      },
      ciServices: {[any.word()]: {scaffolder: foo => ({foo}), public: true}},
      applicationTypes: {
        foo: {
          scaffolder: foo => ({
            foo,
            eslint: {
              configs: this.fooApplicationEslintConfigs,
              ...this.fooApplicationEslintIgnoredDirectories && {
                ignore: {directories: this.fooApplicationEslintIgnoredDirectories}
              }
            },
            buildDirectory: this.fooApplicationBuildDirectory
          })
        }
      },
      monorepoTypes: {
        foo: {scaffolder: foo => ({foo, scripts: this.fooMonorepoScripts})}
      },
      packageTypes: {
        foo: {
          scaffolder: async ({projectRoot}) => {
            await fs.unlink(`${projectRoot}/tsconfig.json`);

            return {};
          }
        },
        'lint-peer': {
          scaffolder: ({projectRoot}) => ({
            scripts: {'lint:peer': this.alternateLintPeerScript},
            projectRoot
          })
        }
      },
      packageBundlers: {
        foo: {scaffolder: async ({projectRoot}) => ({projectRoot, scripts: {['build:js']: 'build script'}})}
      },
      decisions: {
        [questionNames.NODE_VERSION_CATEGORY]: 'LTS',
        [questionNames.PROJECT_TYPE]: this.projectType,
        [questionNames.AUTHOR_NAME]: any.word(),
        [questionNames.AUTHOR_EMAIL]: any.email(),
        [questionNames.AUTHOR_URL]: any.url(),
        [questionNames.UNIT_TESTS]: this.unitTestAnswer,
        ...this.unitTestAnswer && {[questionNames.UNIT_TEST_FRAMEWORK]: this.unitTestFrameworkAnswer},
        [questionNames.INTEGRATION_TESTS]: this.integrationTestAnswer,
        ...null !== this.ciAnswer && {[questionNames.CI_SERVICE]: this.ciAnswer || 'Other'},
        [questionNames.CONFIGURE_LINTING]: this.configureLinting,
        [questionNames.PROVIDE_EXAMPLE]: this.provideExample,
        [questionNames.PROJECT_TYPE_CHOICE]: this.projectTypeChoiceAnswer ||
          this.packageTypeChoiceAnswer ||
          this.applicationTypeChoiceAnswer ||
          'Other',
        [questionNames.HOST]: 'Other',
        ...['Package', 'CLI'].includes(this.projectType) && {
          [questionNames.SHOULD_BE_SCOPED]: shouldBeScopedAnswer,
          ...shouldBeScopedAnswer && {[questionNames.SCOPE]: this.npmAccount}
        },
        ...this.packageManager && {[questionNames.PACKAGE_MANAGER]: this.packageManager},
        [questionNames.DIALECT]: this.dialect,
        [questionNames.PACKAGE_BUNDLER]: this.packageBundler
      },
      unitTestFrameworks: {
        foo: {scaffolder: ({foo}) => ({testFilenamePattern: this.testFilenamePattern, foo})},
        bar: {scaffolder: ({bar}) => ({eslint: {configs: this.barUnitTestFrameworkEslintConfigs}, bar})}
      },
      pathWithinParent: this.pathWithinParent,
      ...this.registries && {registries: this.registries}
    });
  } catch (e) {
    this.resultError = e;
  }
});

When('the scaffolder results are processed', async function () {
  const projectRoot = process.cwd();

  await writePackageJson({
    projectRoot,
    config: {
      ...this.enginesNode && {engines: {node: this.enginesNode}},
      devDependencies: {},
      scripts: this.existingScripts,
      peerDependencies: {},
      keywords: this.existingKeywords,
      dependencies: {},
      name: this.projectName,
      exports: this.packageExports,
      publishConfig: this.publishConfig,
      bin: this.packageBin
    }
  });

  if (await test({projectRoot})) {
    this.results = await lift({
      projectRoot,
      results: {
        scripts: this.scriptsResults,
        tags: this.tagsResults,
        packageManager: this.packageManager,
        eslint: {configs: this.additionalShareableConfigs}
      },
      ...this.eslintConfigScope && {configs: {eslint: {scope: this.eslintConfigScope}}}
    });
  }
});

Then('the expected files for a(n) {string} are generated', async function (projectType) {
  await Promise.all([
    assertThatProperDirectoriesAreIgnoredFromEslint(
      projectType,
      this.configureLinting,
      this.tested,
      this.buildDirectory
    ),
    assertThatPackageDetailsAreConfiguredCorrectlyFor({
      projectType,
      visibility: this.visibility,
      dialect: this.dialect,
      provideExample: this.provideExample,
      tested: this.tested,
      configureLinting: this.configureLinting,
      projectName: this.projectName,
      npmAccount: this.npmAccount
    }),
    assertThatNpmConfigDetailsAreConfiguredCorrectlyFor(projectType),
    assertThatDocumentationIsDefinedAppropriately(projectType, this.projectName, this.dialect, this.provideExample)
  ]);
});

Then('no error is thrown', async function () {
  if (this.resultError) {
    throw this.resultError;
  }
});

Then('the expected results for a(n) {string} are returned to the project scaffolder', async function (projectType) {
  const type = 'any' !== projectType ? projectType : this.projectType;

  if ([projectTypes.PACKAGE, projectTypes.CLI].includes(type)) {
    assert.include(Object.keys(this.scaffoldResult.badges.contribution), 'semantic-release');
  }

  if (projectTypes.PACKAGE === type) {
    const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

    assert.equal(scripts['lint:publish'], 'publint --strict');
    assertDevDependencyIsInstalled(this.execa.default, 'publint')
  }

  if ('github' === this.vcs?.host && 'Public' === this.visibility && this.tested) {
    assert.include(Object.keys(this.scaffoldResult.badges.status), 'coverage');
  }

  assertThatProperDirectoriesAreIgnoredFromVersionControl(this.scaffoldResult, type, this.buildDirectory);
  assertThatProperFilesAreIgnoredFromVersionControl(this.scaffoldResult, type);
  assertThatDocumentationResultsAreReturnedCorrectly(
    type,
    this.npmAccount,
    this.projectName,
    this.visibility,
    this.scaffoldResult,
    this.packageManager,
    this.provideExample
  );
});
