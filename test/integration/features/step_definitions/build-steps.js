import {promises as fs} from 'fs';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the package is bundled', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.equal(scripts['build:js'], 'build script');
});
