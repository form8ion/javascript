import {promises as fs} from 'fs';
import {dialects, projectTypes} from '@form8ion/javascript-core';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

import {assertDevDependencyIsInstalled} from './common-steps.mjs';

Then('the package is bundled', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.equal(scripts['build:js'], 'build script');
});
