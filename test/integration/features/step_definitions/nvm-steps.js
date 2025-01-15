import {promises as fs} from 'node:fs';

import {Given} from '@cucumber/cucumber';
import any from '@travi/any';
import * as td from 'testdouble';
import {semverStringFactory, versionSegment} from './dependencies-steps.js';

const majorVersion = versionSegment();

Given(/^nvm is properly configured$/, function () {
  this.latestLtsMajorVersion = majorVersion;
  this.latestLtsVersion = semverStringFactory({major: majorVersion});

  td.when(this.execa('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true}))
    .thenResolve({stdout: [...any.listOf(semverStringFactory), this.latestLtsVersion, ''].join('\n')});
  td
    .when(this.execa('. ~/.nvm/nvm.sh && nvm install', {shell: true}))
    .thenReturn({stdout: {pipe: () => undefined}});
});

Given('the node version is captured for the project', async function () {
  await fs.writeFile(`${this.projectRoot}/.nvmrc`, semverStringFactory({major: majorVersion}));
});
