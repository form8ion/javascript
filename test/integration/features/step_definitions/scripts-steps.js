import {promises as fs} from 'fs';
import any from '@travi/any';
import {assert} from 'chai';
import {Before, Given, Then} from '@cucumber/cucumber';

Before(function () {
  this.existingScripts = {...any.simpleObject(), test: any.string()};
});

Given('no additional scripts are included in the results', async function () {
  this.scriptsResults = undefined;
});

Given('additional scripts are included in the results', async function () {
  this.scriptsResults = any.simpleObject();
});

Given('additional scripts that duplicate existing scripts are included in the results', async function () {
  this.scriptsResults = any.objectWithKeys(Object.keys(this.existingScripts));
});

Given('the project defines a pregenerate:md script', async function () {
  this.existingScripts = {...this.existingScripts, 'pregenerate:md': 'run-s build'};
});

Given('the project defines lint scripts', async function () {
  this.existingScripts = {...this.existingScripts, [`lint:${any.word()}`]: any.string()};
});

Given('the project defines test scripts', async function () {
  this.existingScripts = {...this.existingScripts, [`test:${any.word()}`]: any.string()};
});

Then('the existing scripts still exist', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));
  const scriptsWithoutTest = Object.entries(this.existingScripts).filter(([name]) => 'test' !== name);

  scriptsWithoutTest.forEach(([scriptName, script]) => assert.equal(scripts[scriptName], script));
});

Then('no extra scripts were added', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  assert.equal(Object.keys(scripts).length, Object.keys(this.existingScripts).length);
});

Then('the additional scripts exist', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));
  const scriptsWithoutTest = Object.entries(this.scriptsResults).filter(([name]) => 'test' !== name);

  scriptsWithoutTest.forEach(([scriptName, script]) => assert.equal(scripts[scriptName], script));
});

Then('the script is added for ensuring the node engines requirement is met', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  assert.equal(scripts['lint:engines'], 'ls-engines');
});

Then('the updated test script includes build', async function () {
  const {scripts: {pretest, test}} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  assert.equal(pretest, 'run-s build');
  assert.notInclude(test, 'build');
});
