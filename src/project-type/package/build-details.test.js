import {promises as fs} from 'node:fs';
import touch from 'touch';
import {dialects, projectTypes} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {scaffold as scaffoldBundler} from '../publishable/bundler/index.js';
import buildDetails from './build-details.js';

vi.mock('node:fs');
vi.mock('make-dir');
vi.mock('touch');
vi.mock('../publishable/bundler');

describe('package build details', () => {
  const projectRoot = any.string();
  const projectName = any.word();
  const pathToExample = `${projectRoot}/example.js`;
  const bundlerResults = any.simpleObject();
  const packageBundlers = any.simpleObject();
  const decisions = any.simpleObject();

  it('should correctly define a common-js project', async () => {
    const results = await buildDetails({
      dialect: dialects.COMMON_JS,
      projectRoot,
      projectName,
      provideExample: true
    });

    expect(results).toEqual({});
    expect(fs.writeFile).toHaveBeenCalledWith(pathToExample, "const {} = require('.');\n");
    expect(touch).toHaveBeenCalledWith(`${projectRoot}/index.js`);
  });

  it('should not create the example file for a common-js project if `provideExample` is `false`', async () => {
    await buildDetails({
      dialect: dialects.COMMON_JS,
      projectRoot,
      projectName,
      provideExample: false
    });

    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('should define a modern-js project correctly', async () => {
    const dialect = dialects.BABEL;
    when(scaffoldBundler)
      .calledWith({bundlers: packageBundlers, decisions, projectRoot, dialect, projectType: projectTypes.PACKAGE})
      .thenResolve(bundlerResults);

    const results = await buildDetails({
      dialect,
      projectRoot,
      projectName,
      packageBundlers,
      decisions,
      provideExample: true
    });

    expect(results).toEqual({
      ...bundlerResults,
      dependencies: {javascript: {development: ['rimraf']}},
      scripts: {
        clean: 'rimraf ./lib',
        prebuild: 'run-s clean',
        build: 'npm-run-all --print-label --parallel build:*',
        prepack: 'run-s build',
        'pregenerate:md': 'run-s build'
      },
      vcsIgnore: {directories: ['/lib/']},
      buildDirectory: 'lib',
      badges: {consumer: {}}
    });
    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/src`, {recursive: true});
    expect(touch).toHaveBeenCalledWith(`${projectRoot}/src/index.js`);
    expect(fs.writeFile).toHaveBeenCalledWith(pathToExample, "import {} from './lib/index.js';\n");
  });

  it('should not create the example file for a modern-js project when `provideExample` is `false`', async () => {
    const dialect = dialects.BABEL;
    when(scaffoldBundler)
      .calledWith({bundlers: packageBundlers, decisions, projectRoot, dialect, projectType: projectTypes.PACKAGE})
      .thenResolve(bundlerResults);

    const results = await buildDetails({
      dialect,
      projectRoot,
      projectName,
      packageBundlers,
      decisions,
      provideExample: false
    });

    expect(results).toEqual({
      ...bundlerResults,
      dependencies: {javascript: {development: ['rimraf']}},
      scripts: {
        clean: 'rimraf ./lib',
        prebuild: 'run-s clean',
        build: 'npm-run-all --print-label --parallel build:*',
        prepack: 'run-s build'
      },
      vcsIgnore: {directories: ['/lib/']},
      buildDirectory: 'lib',
      badges: {consumer: {}}
    });
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('should include the runkit badge for public projects', async () => {
    const packageName = any.word();

    const {badges} = await buildDetails({
      dialect: dialects.BABEL,
      projectRoot,
      projectName,
      packageName,
      visibility: 'Public'
    });

    expect(badges.consumer.runkit).toEqual({
      img: `https://badge.runkitcdn.com/${packageName}.svg`,
      text: `Try ${packageName} on RunKit`,
      link: `https://npm.runkit.com/${packageName}`
    });
  });
});
