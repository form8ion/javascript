import {promises as fs} from 'node:fs';
import {parse} from 'ini';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('provenance is enabled for publishing', async function () {
  const {provenance} = parse(await fs.readFile(`${process.cwd()}/.npmrc`, 'utf-8'));

  assert.isTrue(provenance);
});
