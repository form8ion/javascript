import {promises as fs} from 'node:fs';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';
import {assertDependenciesWereRemoved} from './dependencies-steps.js';

Given('the project has legacy ban-sensitive-files configuration', async function () {
  this.existingScripts['lint:sensitive'] = any.word();
});

Then('ban-sensitive-files is removed from the project', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${this.projectRoot}/package.json`, 'utf-8'));

  assert.isUndefined(scripts['lint:sensitive']);
  assertDependenciesWereRemoved(this.execa, this.packageManager, ['ban-sensitive-files']);
});
