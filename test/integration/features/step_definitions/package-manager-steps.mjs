import {promises as fs} from 'fs';
import {packageManagers} from '@form8ion/javascript-core';

import {Given} from '@cucumber/cucumber';
import any from '@travi/any';
import * as td from 'testdouble';

Given('an {string} lockfile exists', async function (packageManager) {
  if (packageManagers.NPM === packageManager) {
    await fs.writeFile(`${process.cwd()}/package-lock.json`, JSON.stringify(any.simpleObject()));

    td.when(this.execa.default(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install'))).thenResolve({stdout: ''});
  }

  if (packageManagers.YARN === packageManager) {
    await fs.writeFile(`${process.cwd()}/yarn.lock`, any.string());

    td.when(this.execa.default(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && yarn add'))).thenResolve({stdout: ''});
  }

  this.packageManager = packageManager;
  this.projectName = any.word();
});
