import {promises as fs} from 'fs';
import {packageManagers} from '@form8ion/javascript-core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import * as td from 'testdouble';
import {semverStringFactory} from './dependencies-steps.js';

Given('an {string} lockfile exists', async function (packageManager) {
  if (packageManagers.NPM === packageManager) {
    await fs.writeFile(`${process.cwd()}/package-lock.json`, JSON.stringify(any.simpleObject()));

    td
      .when(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install')))
      .thenResolve({stdout: ''});
  }

  if (packageManagers.YARN === packageManager) {
    await fs.writeFile(`${process.cwd()}/yarn.lock`, any.string());

    td
      .when(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && yarn add')))
      .thenResolve({stdout: ''});
  }

  this.packageManager = packageManager;
  this.projectName = any.word();
});

Given('{string} is pinned in the package.json', async function (packageManager) {
  this.packageManager = packageManager;
  this.packageManagerPinnedVersion = semverStringFactory();
});

Given('{string} is defined as the package manager in the results', async function (packageManager) {
  this.packageManager = packageManager;
  this.resultsPackageManager = packageManager;
});

Then('dependencies are installed with {string}', async function (packageManager) {
  if (packageManagers.NPM === packageManager) {
    td.verify(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install')), {ignoreExtraArgs: true});
  }

  if (packageManagers.YARN === packageManager) {
    td.verify(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && yarn add')), {ignoreExtraArgs: true});
  }
});
