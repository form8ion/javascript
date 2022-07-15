import {promises as fs} from 'fs';
import {resolve} from 'path';
import filedirname from 'filedirname';
import {DEV_DEPENDENCY_TYPE, projectTypes} from '@form8ion/javascript-core';

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
const [, __dirname] = filedirname();
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
  this.tested = true;
  this.visibility = any.fromList(['Public', 'Private']);
  this.eslintScope = `@${any.word()}`;
  this.barUnitTestFrameworkEslintConfigs = any.listOf(any.word);
  this.fooApplicationEslintConfigs = [(() => ({name: any.word(), files: any.word()}))()];
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
        foo: {scaffolder: foo => ({foo, eslintConfigs: this.fooApplicationEslintConfigs})}
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
        }
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
        [questionNames.PROJECT_TYPE_CHOICE]: this.projectTypeChoiceAnswer || this.packageTypeChoiceAnswer || 'Other',
        [questionNames.HOST]: 'Other',
        ...['Package', 'CLI'].includes(this.projectType) && {
          [questionNames.SHOULD_BE_SCOPED]: shouldBeScopedAnswer,
          ...shouldBeScopedAnswer && {[questionNames.SCOPE]: this.npmAccount}
        },
        ...this.packageManager && {[questionNames.PACKAGE_MANAGER]: this.packageManager},
        [questionNames.DIALECT]: this.dialect
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

  await fs.writeFile(
    `${projectRoot}/package.json`,
    JSON.stringify({
      name: this.projectName,
      scripts: this.existingScripts,
      keywords: this.existingKeywords,
      ...this.enginesNode && {engines: {node: this.enginesNode}}
    })
  );

  if (await test({projectRoot})) {
    this.results = await lift({
      projectRoot,
      results: {
        scripts: this.scriptsResults,
        tags: this.tagsResults,
        packageManager: this.packageManager,
        eslintConfigs: this.additionalShareableConfigs
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
      tested: this.tested,
      configureLinting: this.configureLinting,
      projectName: this.projectName,
      npmAccount: this.npmAccount
    }),
    assertThatNpmConfigDetailsAreConfiguredCorrectlyFor(projectType),
    assertThatDocumentationIsDefinedAppropriately(projectType, this.projectName, this.configureLinting)
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

  if ('github' === this.vcs?.host && 'Public' === this.visibility) {
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
    this.packageManager
  );
});
