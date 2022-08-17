import {promises as fs} from 'fs';

import {fileExists} from '@form8ion/core';
import {assert} from 'chai';
import {Then} from '@cucumber/cucumber';

Then(/^Babel and ESLint are not scaffolded$/, async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.eslintrc.yml`));
  assert.isFalse(await fileExists(`${process.cwd()}/.babelrc.json`));
});

Then('the package.json properties are sorted', async function () {
  assert.deepEqual(
    Object.keys(JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'))),
    ['name', 'engines', 'keywords', 'scripts', 'dependencies', 'devDependencies', 'peerDependencies']
  );
});
