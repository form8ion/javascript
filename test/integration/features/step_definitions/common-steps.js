import {promises as fs} from 'fs';
import {resolve} from 'path';
import {questionNames as commonQuestionNames} from '@travi/language-scaffolder-prompts';

import {After, Before, Given, setWorldConstructor, Then, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import td from 'testdouble';
import clearModule from 'clear-module';
import {assert} from 'chai';

import {World} from '../support/world';
import {
  assertThatNpmConfigDetailsAreConfiguredCorrectlyFor,
  assertThatPackageDetailsAreConfiguredCorrectlyFor
} from './npm-steps';
import {
  assertThatDocumentationIsDefinedAppropriately,
  assertThatDocumentationResultsAreReturnedCorrectly
} from './documentation-steps';
import {
  assertThatProperDirectoriesAreIgnoredFromVersionControl,
  assertThatProperFilesAreIgnoredFromVersionControl
} from './vcs-steps';
import {assertThatProperDirectoriesAreIgnoredFromEslint} from './eslint-steps';

const pathToProjectRoot = [__dirname, '..', '..', '..', '..'];
const pathToNodeModules = [...pathToProjectRoot, 'node_modules'];
const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

setWorldConstructor(World);

let scaffold, lift, test, questionNames;

function escapeSpecialCharacters(string) {
  return string.replace(/[.*+?^$\-{}()|[\]\\]/g, '\\$&');
}

export function assertDevDependencyIsInstalled(execa, dependencyName) {
  const {DEV_DEPENDENCY_TYPE} = require('@form8ion/javascript-core');

  td.verify(
    execa(td.matchers.contains(
      new RegExp(`(npm install|yarn add).*${escapeSpecialCharacters(dependencyName)}.*${DEV_DEPENDENCY_TYPE}`)
    )),
    {ignoreExtraArgs: true}
  );
}

Before(async function () {
  require('validate-npm-package-name')(any.word()); // eslint-disable-line import/no-extraneous-dependencies

  this.execa = td.replace('@form8ion/execa-wrapper');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({scaffold, lift, test, questionNames} = require('@form8ion/javascript'));

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
  clearModule('@form8ion/husky');
  clearModule('@form8ion/eslint');
  clearModule('@form8ion/javascript-core');
  clearModule('@form8ion/javascript');
  clearModule('@form8ion/commit-convention');
  clearModule('@form8ion/execa-wrapper');
  clearModule('execa');
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
      decisions: {
        [questionNames.NODE_VERSION_CATEGORY]: 'LTS',
        [questionNames.PROJECT_TYPE]: this.projectType,
        [questionNames.AUTHOR_NAME]: any.word(),
        [questionNames.AUTHOR_EMAIL]: any.email(),
        [questionNames.AUTHOR_URL]: any.url(),
        [commonQuestionNames.UNIT_TESTS]: this.unitTestAnswer,
        ...this.unitTestAnswer && {[questionNames.UNIT_TEST_FRAMEWORK]: this.unitTestFrameworkAnswer},
        [commonQuestionNames.INTEGRATION_TESTS]: this.integrationTestAnswer,
        ...null !== this.ciAnswer && {[commonQuestionNames.CI_SERVICE]: this.ciAnswer || 'Other'},
        [questionNames.CONFIGURE_LINTING]: this.configureLinting,
        [questionNames.PROJECT_TYPE_CHOICE]: this.projectTypeChoiceAnswer || 'Other',
        [questionNames.HOST]: 'Other',
        ...['Package', 'CLI'].includes(this.projectType) && {
          [questionNames.SHOULD_BE_SCOPED]: shouldBeScopedAnswer,
          ...shouldBeScopedAnswer && {[questionNames.SCOPE]: this.npmAccount}
        },
        ...this.packageManager && {[questionNames.PACKAGE_MANAGER]: this.packageManager},
        [questionNames.DIALECT]: this.dialect
      },
      unitTestFrameworks: {
        foo: {
          scaffolder: ({foo}) => ({
            testFilenamePattern: this.testFilenamePattern,
            foo
          })
        },
        bar: {
          scaffolder: ({bar}) => ({
            eslint: {configs: this.barUnitTestFrameworkEslintConfigs},
            eslintConfigs: this.barUnitTestFrameworkEslintConfigs,
            bar
          })
        }
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
  const {projectTypes} = require('@form8ion/javascript-core');
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
