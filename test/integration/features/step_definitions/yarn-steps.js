import {promises as fs} from 'fs';
import {packageManagers} from '@form8ion/javascript-core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import * as td from 'testdouble';
import {assert} from 'chai';

import {assertThatNpmConfigDetailsAreConfiguredCorrectlyFor} from './npm-steps.js';
import {semverStringFactory} from './dependencies-steps.js';

Given('the yarn cli is logged in', async function () {
  this.packageManager = packageManagers.YARN;
  this.npmAccount = any.word();
  this.yarnCliVersion = semverStringFactory();

  const error = new Error('Command failed with exit code 1: npm ls husky --json');
  error.exitCode = 1;
  error.stdout = JSON.stringify({});
  error.command = 'npm ls husky --json';

  td.when(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && yarn add'))).thenResolve({stdout: ''});
  td.when(this.execa('yarn', ['--version'])).thenResolve({stdout: this.yarnCliVersion});
  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenResolve({stdout: JSON.stringify({})});
  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(error);
});

Then('the yarn cli is configured for use', async function () {
  const [lockfileLintConfig, packageContents] = await Promise.all([
    fs.readFile(`${process.cwd()}/.lockfile-lintrc.json`, 'utf-8'),
    fs.readFile(`${process.cwd()}/package.json`, 'utf-8'),
    assertThatNpmConfigDetailsAreConfiguredCorrectlyFor(this.projectRoot, this.projectType)
  ]);

  const {type, 'allowed-hosts': allowedHosts, path} = JSON.parse(lockfileLintConfig);
  const {packageManager} = JSON.parse(packageContents);

  assert.equal(type, packageManagers.YARN);
  assert.equal(packageManager, `${packageManagers.YARN}@${this.yarnCliVersion}`);
  assert.include(allowedHosts, packageManagers.YARN);
  assert.equal(path, 'yarn.lock');
  assert.equal(this.scaffoldResult.verificationCommand, 'yarn generate:md && yarn test');
  td.verify(
    this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && yarn add')),
    {ignoreExtraArgs: true}
  );
});
