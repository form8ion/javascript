import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import {projectTypes} from '@form8ion/javascript-core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

Given('the project will be a(n) {string}', async function (projectType) {
  const projectTypeChoices = [...Object.values(projectTypes), 'Other'];

  this.projectType = projectType;
  if ('any' === projectType) {
    this.projectType = any.fromList(projectTypeChoices);
  }

  if (!projectTypeChoices.includes(this.projectType)) {
    throw new Error(`invalid project type: ${this.projectType}`);
  }

  if (projectTypes.CLI === this.projectType) {
    this.buildDirectory = 'bin';
  } else if (projectTypes.MONOREPO === this.projectType) {
    this.buildDirectory = null;
  } else if (projectTypes.APPLICATION === this.projectType) {
    this.buildDirectory = 'public';
  } else if ('Other' === this.projectType) {
    this.buildDirectory = null;
  } else {
    this.buildDirectory = 'lib';
  }
});

Given('an application-type plugin is chosen', async function () {
  this.applicationTypeChoiceAnswer = 'foo';
  this.fooApplicationEslintConfigs = [(() => ({name: any.word(), files: any.word()}))()];
  this.fooApplicationBuildDirectory = any.word();
  this.buildDirectory = this.fooApplicationBuildDirectory;
});

Given('the project is of type {string}', async function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the expected details are provided for a root-level project', async function () {
  const nvmRc = await fs.readFile(`${process.cwd()}/.nvmrc`);

  assert.equal(nvmRc.toString(), `v${this.latestLtsMajorVersion}`);
  assert.isTrue(await fileExists(`${process.cwd()}/.czrc`));
  assert.isTrue(await fileExists(`${process.cwd()}/.commitlintrc.js`));
  assert.containsAllKeys(this.scaffoldResult.badges.contribution, ['commit-convention', 'commitizen']);
});
