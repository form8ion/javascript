import {promises as fs} from 'node:fs';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('provenance is enabled for publishing', async function () {
  const {publishConfig} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.isTrue(publishConfig.provenance);
});
