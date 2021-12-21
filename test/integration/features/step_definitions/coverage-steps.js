import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

Given('existing nyc config is present', async function () {
  await fs.writeFile(`${process.cwd()}/.nycrc`, JSON.stringify(any.simpleObject()));
});

Given('existing c8 config is present', async function () {
  await fs.writeFile(`${process.cwd()}/.c8rc.json`, JSON.stringify(any.simpleObject()));
});

Then('nyc is not configured for code coverage', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.nycrc`));
});

Then('c8 is configured for code coverage', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/.c8rc.json`));
});
