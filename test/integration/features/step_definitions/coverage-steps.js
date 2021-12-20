import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

Given('existing {string} config is present', async function (coverageTool) {
  await fs.writeFile(`${process.cwd()}/.${coverageTool}rc`, JSON.stringify(any.simpleObject()));
});

Then('{string} is not configured for code coverage', async function (coverageTool) {
  assert.isFalse(await fileExists(`${process.cwd()}/.${coverageTool}rc`));
});

Then('{string} is configured for code coverage', async function (coverageTool) {
  assert.isTrue(await fileExists(`${process.cwd()}/.${coverageTool}rc`));
});
