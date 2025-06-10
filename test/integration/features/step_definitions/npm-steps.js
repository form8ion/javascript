import {promises as fs} from 'fs';
import {parse} from 'ini';
import {dialects, packageManagers, projectTypes} from '@form8ion/javascript-core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';
import * as td from 'testdouble';
import {semverStringFactory} from './dependencies-steps.js';

function isNonConsumable(projectType) {
  const {APPLICATION, CLI} = projectTypes;

  return APPLICATION === projectType || CLI === projectType;
}

function assertThatPackageSpecificDetailsAreDefinedCorrectly(
  packageDetails,
  npmAccount,
  projectName,
  dialect,
  visibility
) {
  assert.equal(packageDetails.name, `@${npmAccount}/${projectName}`);
  assert.equal(packageDetails.version, '0.0.0-semantically-released');

  if (dialects.COMMON_JS === dialect) {
    assert.deepEqual(packageDetails.files, ['example.js', 'index.js']);
    assert.isUndefined(packageDetails.main);
    assert.isUndefined(packageDetails.module);
  } else if (dialects.ESM === dialect) {
    assert.equal(packageDetails.main, './lib/index.js');
    assert.equal(packageDetails.exports, './lib/index.js');
    assert.isUndefined(packageDetails.module);
    assert.deepEqual(packageDetails.files, ['example.js', 'lib/', 'src/']);
    assert.isFalse(packageDetails.sideEffects);
  } else if (dialects.TYPESCRIPT === dialect) {
    assert.equal(packageDetails.types, './lib/index.d.ts');
    assert.equal(packageDetails.main, './lib/index.js');
    assert.equal(packageDetails.module, './lib/index.mjs');
    assert.deepEqual(
      packageDetails.exports,
      {types: './lib/index.d.ts', require: './lib/index.js', import: './lib/index.mjs'}
    );
    assert.deepEqual(packageDetails.files, ['example.js', 'lib/', 'src/']);
    assert.isFalse(packageDetails.sideEffects);
  } else {
    assert.equal(packageDetails.main, './lib/index.js');
    assert.equal(packageDetails.module, './lib/index.mjs');
    assert.deepEqual(
      packageDetails.exports,
      {module: './lib/index.mjs', require: './lib/index.js', import: './lib/index.mjs'}
    );
    assert.deepEqual(packageDetails.files, ['example.js', 'lib/', 'src/']);
    assert.isFalse(packageDetails.sideEffects);
  }

  if ('Public' === visibility) {
    assert.equal(packageDetails.runkitExampleFilename, './example.js');
    assert.equal(packageDetails.publishConfig.access, 'public');
  } else {
    assert.isUndefined(packageDetails.runkitExampleFilename);
    assert.deepEqual(packageDetails.publishConfig.access, 'restricted');
  }
}

function assertThatApplicationSpecificDetailsAreDefinedCorrectly(packageDetails, projectName) {
  assert.equal(packageDetails.name, projectName);
  assert.isTrue(packageDetails.private);

  assert.isUndefined(packageDetails.files);
  assert.isUndefined(packageDetails.version);
  assert.isUndefined(packageDetails.publishConfig);
}

function assertThatCliSpecificDetailsAreDefinedCorrectly(packageDetails, npmAccount, projectName, visibility) {
  assert.equal(packageDetails.name, `@${npmAccount}/${projectName}`);
  assert.equal(packageDetails.version, '0.0.0-semantically-released');
  assert.deepEqual(packageDetails.bin, {});
  assert.deepEqual(packageDetails.files, ['bin/']);
  assert.deepEqual(packageDetails.publishConfig.access, 'Private' === visibility ? 'restricted' : 'public');
}

export async function assertThatPackageDetailsAreConfiguredCorrectlyFor({
  projectRoot,
  projectType,
  visibility,
  tested,
  dialect,
  provideExample,
  projectName,
  npmAccount
}) {
  const packageDetails = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));

  if (tested && projectTypes.PACKAGE === projectType && provideExample && dialects.COMMON_JS !== dialect) {
    assert.equal(packageDetails.scripts.pretest, 'run-s build');
    assert.equal(packageDetails.scripts.test, 'npm-run-all --print-label --parallel lint:* --parallel test:*');
  } else if (tested) {
    assert.isUndefined(packageDetails.scripts.pretest);
    assert.equal(packageDetails.scripts.test, 'npm-run-all --print-label --parallel lint:* --parallel test:*');
  } else {
    assert.isUndefined(packageDetails.scripts.pretest);
    assert.equal(packageDetails.scripts.test, 'npm-run-all --print-label --parallel lint:*');
  }

  if (projectTypes.APPLICATION === projectType) {
    assertThatApplicationSpecificDetailsAreDefinedCorrectly(packageDetails, projectName);
  } else if (projectTypes.MONOREPO === projectType) {
    assert.isTrue(packageDetails.private);
  } else {
    assert.isUndefined(packageDetails.private);
  }

  if (projectTypes.PACKAGE === projectType) {
    assertThatPackageSpecificDetailsAreDefinedCorrectly(
      packageDetails,
      npmAccount,
      projectName,
      dialect,
      visibility
    );
  } else {
    assert.isUndefined(packageDetails.main);
    assert.isUndefined(packageDetails.module);
    assert.isUndefined(packageDetails.sideEffects);
  }

  if (projectTypes.CLI === projectType) {
    assertThatCliSpecificDetailsAreDefinedCorrectly(packageDetails, npmAccount, projectName, visibility);
  } else {
    assert.isUndefined(packageDetails.bin);
  }
}

export async function assertThatNpmConfigDetailsAreConfiguredCorrectlyFor(projectRoot, projectType) {
  const {
    'update-notifier': updateNotifier,
    'save-exact': saveExact,
    provenance
  } = parse(await fs.readFile(`${projectRoot}/.npmrc`, 'utf-8'));

  assert.isFalse(updateNotifier);

  if (isNonConsumable(projectType)) {
    assert.isTrue(saveExact);
  } else {
    assert.isUndefined(saveExact);
  }

  assert.isUndefined(provenance);
}

Given(/^the npm cli is logged in$/, function () {
  this.packageManager = packageManagers.NPM;
  this.npmAccount = any.word();
  this.npmCliVersion = semverStringFactory();

  const error = new Error('Command failed with exit code 1: npm ls husky --json');
  error.exitCode = 1;
  error.stdout = JSON.stringify({});
  error.command = 'npm ls husky --json';

  td.when(this.execa('npm', ['whoami'])).thenResolve({stdout: this.npmAccount});
  td.when(this.execa('npm', ['--version'])).thenResolve({stdout: this.npmCliVersion});
  td
    .when(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install')))
    .thenResolve({stdout: ''});
  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(error);
});

Then('the npm cli is configured for use', async function () {
  const [lockfileLintConfig, packageContents] = await Promise.all([
    fs.readFile(`${process.cwd()}/.lockfile-lintrc.json`, 'utf-8'),
    fs.readFile(`${process.cwd()}/package.json`, 'utf-8'),
    assertThatNpmConfigDetailsAreConfiguredCorrectlyFor(this.projectRoot, this.projectType)
  ]);

  const {type, 'allowed-hosts': allowedHosts, path} = JSON.parse(lockfileLintConfig);
  const {packageManager} = JSON.parse(packageContents);

  assert.equal(type, packageManagers.NPM);
  assert.equal(packageManager, `${packageManagers.NPM}@${this.npmCliVersion}`);
  assert.include(allowedHosts, packageManagers.NPM);
  assert.equal(path, 'package-lock.json');
  assert.equal(this.scaffoldResult.verificationCommand, 'npm run generate:md && npm test');
  td.verify(
    this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install')),
    {ignoreExtraArgs: true}
  );
});
