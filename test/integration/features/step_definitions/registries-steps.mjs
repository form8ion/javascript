import {promises as fs} from 'fs';
import {parse} from 'ini';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

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

Then('the registry configuration is defined', async function () {
  const [npmConfigIni, lockfileLintJson] = await Promise.all([
    fs.readFile(`${this.projectRoot}/.npmrc`, 'utf-8'),
    fs.readFile(`${this.projectRoot}/.lockfile-lintrc.json`, 'utf-8')
  ]);
  const npmConfig = parse(npmConfigIni);
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
  const npmConfig = parse(await fs.readFile(`${this.projectRoot}/.npmrc`, 'utf-8'));

  assert.equal(npmConfig.registry, 'https://registry.npmjs.org');
});

