import {promises as fs} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import validateNpmPackageName from 'validate-npm-package-name';
import {DEV_DEPENDENCY_TYPE, projectTypes, writePackageJson} from '@form8ion/javascript-core';

import {After, Before, Given, Then, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import * as td from 'testdouble';
import {assert} from 'chai';

import {
  assertThatNpmConfigDetailsAreConfiguredCorrectlyFor,
  assertThatPackageDetailsAreConfiguredCorrectlyFor
} from './npm-steps.js';
import {
  assertThatDocumentationIsDefinedAppropriately,
  assertThatDocumentationResultsAreReturnedCorrectly
} from './documentation-steps.js';
import {
  assertThatProperDirectoriesAreIgnoredFromVersionControl,
  assertThatProperFilesAreIgnoredFromVersionControl
} from './vcs-steps.js';
import {assertThatProperDirectoriesAreIgnoredFromEslint} from './eslint-steps.js';
import {assertHomepageDefinedProperly} from './project-type-steps.js';

let scaffold, lift, test, questionNames;
const __dirname = dirname(fileURLToPath(import.meta.url));          // eslint-disable-line no-underscore-dangle
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
  validateNpmPackageName(any.word());

  this.execa = (await td.replaceEsm('execa')).execa;
  this.projectRoot = process.cwd();

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({scaffold, lift, test, questionNames} = await import('@form8ion/javascript'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    templates: {
      'example.mustache': await fs.readFile(resolve(...pathToProjectRoot, 'templates', 'example.mustache'))
    }
  });

  this.configureLinting = true;
  this.provideExample = true;
  this.tested = true;
  this.visibility = any.fromList(['Public', 'Private']);
  this.eslintScope = `@${any.word()}`;
  this.barUnitTestFrameworkEslintConfigs = any.listOf(any.word);
  this.fooMonorepoScripts = any.simpleObject();
  this.projectName = `${any.word()}-${any.word()}`;
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

  try {
    this.scaffoldResult = await scaffold({
      projectRoot: this.projectRoot,
      projectName: this.projectName,
      visibility: this.visibility,
      license: any.string(),
      vcs: this.vcs,
      configs: {
        eslint: {scope: this.eslintScope},
        babelPreset: this.babelPreset,
        commitlint: {name: any.word(), packageName: any.word()},
        ...this.typescriptConfig && {typescript: this.typescriptConfig},
        ...this.registries && {registries: this.registries}
      },
      plugins: {
        unitTestFrameworks: {
          foo: {scaffold: ({foo}) => ({testFilenamePattern: this.testFilenamePattern, foo})},
          bar: {scaffold: ({bar}) => ({eslint: {configs: this.barUnitTestFrameworkEslintConfigs}, bar})}
        },
        packageBundlers: {
          foo: {scaffold: async ({projectRoot}) => ({projectRoot, scripts: {'build:js': 'build script'}})}
        },
        applicationTypes: {
          foo: {
            scaffold: foo => ({
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
          foo: {scaffold: foo => ({foo, scripts: this.fooMonorepoScripts})}
        },
        packageTypes: {
          foo: {
            scaffold: async ({projectRoot}) => {
              await fs.unlink(`${projectRoot}/tsconfig.json`);

              return {};
            }
          },
          'lint-peer': {
            scaffold: ({projectRoot}) => ({
              scripts: {'lint:peer': this.alternateLintPeerScript},
              projectRoot
            })
          }
        },
        ciServices: {[any.word()]: {scaffold: foo => ({foo}), public: true}}
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
        [questionNames.PROJECT_TYPE_CHOICE]: this.projectTypeChoiceAnswer
          || this.packageTypeChoiceAnswer
          || this.applicationTypeChoiceAnswer
          || 'Other',
        [questionNames.HOST]: 'Other',
        ...['Package', 'CLI'].includes(this.projectType) && {
          [questionNames.SHOULD_BE_SCOPED]: shouldBeScopedAnswer,
          ...shouldBeScopedAnswer && {[questionNames.SCOPE]: this.npmAccount}
        },
        ...this.packageManager && {[questionNames.PACKAGE_MANAGER]: this.packageManager},
        [questionNames.DIALECT]: this.dialect,
        [questionNames.PACKAGE_BUNDLER]: this.packageBundler
      },
      pathWithinParent: this.pathWithinParent
    });

    this.liftResult = await lift({
      projectRoot: this.projectRoot,
      vcs: this.vcs,
      results: this.scaffoldResult,
      ...(this.eslintConfigScope || this.registries) && {
        configs: {
          eslint: {scope: this.eslintConfigScope},
          registries: this.registries
        }
      }
    });
  } catch (e) {
    this.resultError = e;
  }
});

When('the scaffolder results are processed', async function () {
  await writePackageJson({
    projectRoot: this.projectRoot,
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
      bin: this.packageBin,
      repository: this.repository,
      ...this.packageManagerPinnedVersion && {
        packageManager: `${this.packageManager}@${this.packageManagerPinnedVersion}`
      }
    }
  });

  if (await test({projectRoot: this.projectRoot})) {
    this.results = await lift({
      projectRoot: this.projectRoot,
      vcs: this.vcs,
      results: {
        scripts: this.scriptsResults,
        tags: this.tagsResults,
        ...this.resultsPackageManager && {packageManager: this.resultsPackageManager},
        eslint: {configs: this.additionalShareableConfigs}
      },
      ...(this.eslintConfigScope || this.registries) && {
        configs: {
          eslint: {scope: this.eslintConfigScope},
          registries: this.registries
        }
      }
    });
  } else {
    this.isJavaScriptProject = false;
  }
});

Then('the expected files for a(n) {string} are generated', async function (projectType) {
  await Promise.all([
    assertThatProperDirectoriesAreIgnoredFromEslint(
      this.projectRoot,
      projectType,
      this.configureLinting,
      this.tested,
      this.buildDirectory
    ),
    assertThatPackageDetailsAreConfiguredCorrectlyFor({
      projectRoot: this.projectRoot,
      projectType,
      visibility: this.visibility,
      dialect: this.dialect,
      provideExample: this.provideExample,
      tested: this.tested,
      configureLinting: this.configureLinting,
      projectName: this.projectName,
      npmAccount: this.npmAccount
    }),
    assertThatNpmConfigDetailsAreConfiguredCorrectlyFor(this.projectRoot, projectType),
    assertThatDocumentationIsDefinedAppropriately(
      this.projectRoot,
      projectType,
      this.projectName,
      this.dialect,
      this.provideExample
    )
  ]);
});

Then('no error is thrown', async function () {
  if (this.resultError) {
    throw this.resultError;
  }
});

Then('the expected results for a(n) {string} are returned to the project scaffolder', async function (projectType) {
  const type = 'any' !== projectType ? projectType : this.projectType;
  const {scripts, homepage} = JSON.parse(await fs.readFile(`${this.projectRoot}/package.json`, 'utf-8'));

  if ([projectTypes.PACKAGE, projectTypes.CLI].includes(type)) {
    assert.include(Object.keys(this.liftResult.badges.contribution), 'semantic-release');
  }

  if (projectTypes.PACKAGE === type) {
    assert.equal(scripts['lint:publish'], 'publint --strict');
    assertDevDependencyIsInstalled(this.execa, 'publint');
  }

  if ('github' === this.vcs?.host && 'Public' === this.visibility && this.tested) {
    assert.include(Object.keys(this.liftResult.badges.status), 'coverage');
  }

  assertHomepageDefinedProperly(homepage, this.projectType, this.projectName, this.npmAccount, this.vcs);
  assertHomepageDefinedProperly(
    this.scaffoldResult.projectDetails.homepage,
    this.projectType,
    this.projectName,
    this.npmAccount,
    this.vcs
  );
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
