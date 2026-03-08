import {promises as fs} from 'node:fs';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

Given('the package has runkit details in the package.json', async function () {
  this.runkitExampleFilename = any.word();
});

Given('the README has a runkit badge', async function () {
  return undefined;
});

Then('the runkit details are removed from the package.json', async function () {
  const {runkitExampleFilename} = JSON.parse(await fs.readFile(`${this.projectRoot}/package.json`, 'utf-8'));

  assert.isUndefined(runkitExampleFilename);
});

Then('a next-step is defined to suggest removing the runkit badge from the README', async function () {
  assert.include(this.results.nextSteps, 'Remove the runkit badge from the README');
});
