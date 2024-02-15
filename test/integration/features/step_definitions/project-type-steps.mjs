import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import {projectTypes} from '@form8ion/javascript-core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

export function assertHomepageDefinedProperlyForPackage(homepage, projectType, projectName, npmAccount, vcs) {
  if (projectTypes.PACKAGE === projectType && vcs && 'github' === vcs.host) {
    const packageName = `@${npmAccount}/${projectName}`;
    assert.equal(homepage, `https://npm.im/${packageName}`);
  } else if (vcs && 'github' === vcs.host) {
    assert.equal(homepage, `https://github.com/${vcs.owner}/${vcs.name}#readme`);
  } else if (!vcs) {
    assert.isUndefined(homepage);
  } else {
    assert.equal(homepage, '');
  }
}

Given('the project will be a(n) {string}', async function (projectType) {
  const projectTypeChoices = [...Object.values(projectTypes), 'Other'];

  this.projectType = projectType;
  if ('any' === projectType) {
    this.projectType = any.fromList(projectTypeChoices);
  }

  if (!projectTypeChoices.includes(this.projectType)) {
    throw new Error(`invalid project type: ${this.projectType}`);
  }

  if ([projectTypes.CLI, projectTypes.PACKAGE].includes(this.projectType)) {
    this.packageBundler = 'foo';
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

Given('the project is of type {string}', async function (projectType) {
  const resolvedProjectType = 'Publishable' === projectType ? any.fromList([projectTypes.PACKAGE, projectTypes.CLI]) : projectType;

  if (projectTypes.PACKAGE === resolvedProjectType) {
    this.packageExports = any.word();
    this.publishConfig = {};
  }
  if (projectTypes.CLI === resolvedProjectType) {
    this.packageBin = any.word();
    this.publishConfig = {};
  }
});

Given('the project is of type {string} but without exports defined', async function (projectType) {
  if (projectTypes.PACKAGE === projectType) {
    this.publishConfig = {};
  }
});

Then('the expected details are provided for a root-level project', async function () {
  const nvmRc = await fs.readFile(`${process.cwd()}/.nvmrc`);

  assert.equal(nvmRc.toString(), `v${this.latestLtsMajorVersion}`);
  assert.isTrue(await fileExists(`${process.cwd()}/.czrc`));
  assert.isTrue(await fileExists(`${process.cwd()}/.commitlintrc.json`));
  assert.containsAllKeys(this.scaffoldResult.badges.contribution, ['commit-convention', 'commitizen']);
});
