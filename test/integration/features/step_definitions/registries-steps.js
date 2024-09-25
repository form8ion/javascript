import {promises as fs} from 'fs';
import {fileTypes} from '@form8ion/core';
import {write} from '@form8ion/config-file';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

import {read as readNpmConfig} from '../../../../src/npm-config/index.js';

Given('registries are defined for scopes', async function () {
  this.registries = any.objectWithKeys(any.listOf(any.word), {factory: any.url});
});

Given('an override is defined for the official registry', async function () {
  this.registries = {registry: any.url()};
});

Given('an alternative registry is defined for publishing', async function () {
  this.registries = {publish: any.url()};
});

Given('the npmrc does not define registry', async function () {
  await fs.writeFile(`${this.projectRoot}/.npmrc`, '');
});

Given('lockfile-lint is configured', async function () {
  await write({
    name: 'lockfile-lint',
    format: fileTypes.JSON,
    path: this.projectRoot,
    config: {
      ...any.simpleObject(),
      'allowed-hosts': any.listOf(any.url)
    }
  });
});

Given('lockfile-lint is not configured', async function () {
  return undefined;
});

Then('the registry configuration is defined', async function () {
  const [npmConfig, lockfileLintJson] = await Promise.all([
    readNpmConfig({projectRoot: this.projectRoot}),
    fs.readFile(`${this.projectRoot}/.lockfile-lintrc.json`, 'utf-8')
  ]);
  const lockfileLintConfig = JSON.parse(lockfileLintJson);

  Object.entries(this.registries).forEach(([scope, url]) => {
    if ('registry' === scope) {
      assert.equal(npmConfig.registry, url);
      assert.include(lockfileLintConfig['allowed-hosts'], url);
      assert.notInclude(lockfileLintConfig['allowed-hosts'], 'npm');
      assert.notInclude(lockfileLintConfig['allowed-hosts'], 'yarn');
    } else if ('publish' === scope) {
      assert.notInclude(lockfileLintConfig['allowed-hosts'], url);
      assert.isUndefined(npmConfig['@publish:registry']);
    } else {
      assert.equal(npmConfig[`@${scope}:registry`], url);
      assert.include(lockfileLintConfig['allowed-hosts'], url);
    }
  });
});

Then('the publish registry is defined', async function () {
  const {publishConfig} = JSON.parse(await fs.readFile(`${this.projectRoot}/package.json`, 'utf-8'));

  assert.equal(publishConfig.registry, this.registries.publish);
});

Then('registry is defined as the official registry', async function () {
  const npmConfig = await readNpmConfig({projectRoot: this.projectRoot});

  assert.equal(npmConfig.registry, 'https://registry.npmjs.org');
});

Then('registry is defined as an alternate registry', async function () {
  const npmConfig = await readNpmConfig({projectRoot: this.projectRoot});

  assert.equal(npmConfig.registry, this.registries.registry);
});

Then('the lockfile-lint config allows the {string} registry', async function (packageManager) {
  const {
    'allowed-hosts': allowedHosts
  } = JSON.parse(await fs.readFile(`${this.projectRoot}/.lockfile-lintrc.json`, 'utf-8'));

  assert.include(allowedHosts, packageManager);
});

Then('the lockfile-lint config allows the custom registry', async function () {
  const {
    'allowed-hosts': allowedHosts
  } = JSON.parse(await fs.readFile(`${this.projectRoot}/.lockfile-lintrc.json`, 'utf-8'));

  assert.include(allowedHosts, this.registries.registry);
});

Then('the lockfile-lint config allows the scoped registries', async function () {
  const {
    'allowed-hosts': allowedHosts
  } = JSON.parse(await fs.readFile(`${this.projectRoot}/.lockfile-lintrc.json`, 'utf-8'));

  Object.values(this.registries).forEach(registry => assert.include(allowedHosts, registry));
});
