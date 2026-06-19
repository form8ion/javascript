import {promises as fs} from 'fs';
import {projectTypes} from '@form8ion/javascript-core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

const repoOwner = any.word();
const repoName = any.word();

export function assertThatProperDirectoriesAreIgnoredFromVersionControl(scaffoldResult, projectType, buildDirectory) {
  assert.include(scaffoldResult.vcsIgnore.directories, '/node_modules/');
  if (buildDirectory) assert.include(scaffoldResult.vcsIgnore.directories, `/${buildDirectory}/`);

  if (projectTypes.CLI === projectType) {
    assert.notInclude(scaffoldResult.vcsIgnore.directories, '/lib/');
  } else {
    assert.notInclude(scaffoldResult.vcsIgnore.directories, '/bin/');
  }
}

export function assertThatProperFilesAreIgnoredFromVersionControl(scaffoldResult, projectType) {
  if (projectTypes.APPLICATION === projectType) {
    assert.include(scaffoldResult.vcsIgnore.files, '.env');
  } else {
    assert.notInclude(scaffoldResult.vcsIgnore.files, '.env');
  }
}

Given(/^the project will not be versioned$/, async function () {
  this.vcs = undefined;
});

Given(/^the project will be versioned on GitHub$/, async function () {
  this.vcs = {host: 'github.com', owner: repoOwner, name: repoName};
});

Given('the project is versioned on GitHub', async function () {
  this.vcs = {host: 'github.com', owner: repoOwner, name: repoName};
});

Then('no repository details will be defined', async function () {
  const {repository} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`));

  assert.isUndefined(repository);
});

Then('repository details will be defined using the full object format', async function () {
  const {repository} = JSON.parse(await fs.readFile(`${this.projectRoot}/package.json`));

  assert.deepEqual(
    repository,
    {
      type: 'git',
      url: `git+https://github.com/${repoOwner}/${repoName}.git`
    }
  );
});

Then('the repository details include the path within the parent project', async function () {
  const {repository} = JSON.parse(await fs.readFile(`${this.projectRoot}/package.json`));

  assert.deepEqual(
    repository,
    {
      type: 'git',
      url: `git+https://github.com/${repoOwner}/${repoName}.git`,
      directory: this.pathWithinParent
    }
  );
});
