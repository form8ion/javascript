import {promises as fs} from 'fs';

import {fileExists} from '@form8ion/core';
import {packageManagers} from '@form8ion/javascript-core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import * as td from 'testdouble';
import any from '@travi/any';

export async function assertHookContainsScript(hook, script) {
  const hookContents = await fs.readFile(`${process.cwd()}/.husky/${hook}`, 'utf-8');

  assert.equal(hookContents, script);
}

Given('husky v5 is installed', async function () {
  td
    .when(this.execa.default('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});
});

Given('husky v4 is installed', async function () {
  td
    .when(this.execa.default('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '4.5.6'}}})});
});

Given('husky is not installed', async function () {
  const error = new Error('Command failed with exit code 1: npm ls husky --json');
  error.exitCode = 1;
  error.stdout = JSON.stringify({});
  error.command = 'npm ls husky --json';

  td.when(this.execa.default('npm', ['ls', 'husky', '--json'])).thenReject(error);
});

Given('husky config is in v4 format', async function () {
  await fs.writeFile(`${process.cwd()}/.huskyrc.json`, JSON.stringify(any.simpleObject()));
});

Given('husky config is in v5 format', async function () {
  await fs.mkdir(`${process.cwd()}/.husky`, {recursive: true});
});

Then('husky is configured for a {string} project', async function (packageManager) {
  td.verify(this.execa.default(td.matchers.contains(/(npm install|yarn add).*husky/)), {ignoreExtraArgs: true});

  await assertHookContainsScript('pre-commit', `${packageManager} test`);
  await assertHookContainsScript('commit-msg', 'npx --no-install commitlint --edit $1');
});

Then('husky is configured for {string}', async function (packageManager) {
  if (packageManagers.NPM === packageManager) {
    td.verify(
      this.execa.default(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install')),
      {ignoreExtraArgs: true}
    );
  }
  if (packageManagers.YARN === packageManager) {
    td.verify(
      this.execa.default(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && yarn add')),
      {ignoreExtraArgs: true}
    );
  }
  td.verify(this.execa.default(td.matchers.contains(/(npm install|yarn add).*husky@latest/)), {ignoreExtraArgs: true});
  assert.equal(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).scripts.prepare,
    'husky'
  );
  await assertHookContainsScript('pre-commit', `${packageManager} test`);
});

Then('the next-steps include a warning about the husky config', async function () {
  assert.deepInclude(
    this.results.nextSteps,
    {summary: 'Husky configuration is outdated for the installed Husky version'}
  );
});

Then('the next-steps do not include a warning about the husky config', async function () {
  const {nextSteps} = this.results;

  if (nextSteps) {
    assert.notDeepInclude(nextSteps, {summary: 'Husky configuration is outdated for the installed Husky version'});
  }
});

Then('the v4 config is removed', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.huskyrc.json`));
});
