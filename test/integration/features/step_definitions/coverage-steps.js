import {promises as fs} from 'fs';
import makeDir from 'make-dir';
import {directoryExists, fileExists} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

Given('existing nyc config is present', async function () {
  await fs.writeFile(`${process.cwd()}/.nycrc`, JSON.stringify(any.simpleObject()));
  const nycOutputDirectory = await makeDir(`${process.cwd()}/.nyc_output`);
  await fs.writeFile(`${nycOutputDirectory}/foo.txt`, any.string());
});

Given('existing c8 config is present', async function () {
  await fs.writeFile(`${process.cwd()}/.c8rc.json`, JSON.stringify(any.simpleObject()));
});

Then('nyc is not configured for code coverage', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.nycrc`));
  assert.isFalse(await directoryExists(`${process.cwd()}/.nyc_output`));
});

Then('c8 is configured for code coverage', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/.c8rc.json`));
});
