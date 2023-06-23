import {promises as fs} from 'node:fs';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {assertDevDependencyIsInstalled} from './dependencies-steps.mjs';

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
