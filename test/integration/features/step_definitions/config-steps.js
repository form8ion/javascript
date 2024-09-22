import {promises as fs} from 'fs';

import {fileExists} from '@form8ion/core';
import {assert} from 'chai';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';

Given('the package-type plugin modifies the lint-peer script', async function () {
  this.packageTypeChoiceAnswer = 'lint-peer';
  this.alternateLintPeerScript = any.word();
});

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

Then('the alternate lint-peer script is used', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.equal(scripts['lint:peer'], this.alternateLintPeerScript);
});
