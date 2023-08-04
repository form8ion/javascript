import {Given, Then} from '@cucumber/cucumber';
import {promises as fs} from 'node:fs';
import {assert} from 'chai';
import {assertDevDependencyIsInstalled} from './dependencies-steps.mjs';

Given('the package access is restricted', async function () {
  this.publishConfig.access = 'restricted';
});

Given('the package is published publicly', async function () {
  this.publishConfig.access = 'public';
});

Given('the package is published with provenance', async function () {
  this.publishConfig.provenance = true;
});

Given('the package is published without provenance', async function () {
  this.publishConfig.provenance = null;
});

Then('provenance is enabled for publishing', async function () {
  const {publishConfig} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.isTrue(publishConfig.provenance);
  assert.equal(publishConfig.access, 'public');
});

Then('publint is configured', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.equal(scripts['lint:publish'], 'publint --strict');
  assertDevDependencyIsInstalled(this.execa.default, 'publint');
});
