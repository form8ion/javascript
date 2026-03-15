import {promises as fs} from 'fs';
import any from '@travi/any';
import {assert} from 'chai';
import {Before, Given, Then} from '@cucumber/cucumber';

Before(function () {
  this.existingScripts = {
    aaa: any.string(),
    ccc: any.string(),
    zzz: any.string(),
    test: any.string(),
    'lint:md': any.string(),
    prepare: any.string(),
    'pretest:integration:base': any.string(),
    'test:unit:base': any.string(),
    'test:integration:base': any.string(),
    'test:integration:debug': any.string(),
    'test:integration:focus': any.string(),
    build: any.string(),
    'test:integration:focus:debug': any.string(),
    'test:integration:wip': any.string(),
    prebuild: any.string(),
    'test:integration:wip:debug': any.string(),
    'test:unit': any.string(),
    pretest: any.string(),
    'prelint:publish': 'run-s build',
    'test:integration': any.string()
  };
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

Then('the scripts are ordered correctly', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  assert.deepEqual(
    Object.keys(scripts),
    [
      'pretest',
      'test',
      'lint:lockfile',
      'lint:md',
      'prelint:publish',
      'lint:publish',
      'test:unit',
      'test:unit:base',
      'test:integration',
      'pretest:integration:base',
      'test:integration:base',
      'test:integration:debug',
      'test:integration:focus',
      'test:integration:focus:debug',
      'test:integration:wip',
      'test:integration:wip:debug',
      'aaa',
      'prebuild',
      'build',
      'ccc',
      'prepare',
      'zzz'
    ]
  );
});
