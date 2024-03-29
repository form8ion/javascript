import {promises as fs} from 'fs';
import makeDir from 'make-dir';
import touch from 'touch';
import camelcase from 'camelcase';
import mustache from 'mustache';
import {dialects, projectTypes} from '@form8ion/javascript-core';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import templatePath from '../../template-path.js';
import {scaffold as scaffoldBundler} from '../publishable/bundler/index.js';
import buildDetails from './build-details.js';

vi.mock('fs');
vi.mock('make-dir');
vi.mock('camelcase');
vi.mock('mustache');
vi.mock('touch');
vi.mock('../../template-path');
vi.mock('../publishable/bundler');

describe('package build details', () => {
  const projectRoot = any.string();
  const projectName = any.word();
  const pathToExample = `${projectRoot}/example.js`;
  const pathToCreatedSrcDirectory = any.string();
  const bundlerResults = any.simpleObject();
  const exampleContent = any.string();
  const pathToExampleTemplate = any.string();
  const exampleTemplateContent = any.string();
  const camelizedProjectName = any.word();
  const packageBundlers = any.simpleObject();
  const decisions = any.simpleObject();

  beforeEach(() => {
    when(makeDir).calledWith(`${projectRoot}/src`).mockResolvedValue(pathToCreatedSrcDirectory);
    when(templatePath).calledWith('example.mustache').mockReturnValue(pathToExampleTemplate);
    when(fs.readFile).calledWith(pathToExampleTemplate, 'utf8').mockResolvedValue(exampleTemplateContent);
    when(camelcase).calledWith(projectName).mockReturnValue(camelizedProjectName);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly define a common-js project', async () => {
    const results = await buildDetails({
      dialect: dialects.COMMON_JS,
      projectRoot,
      projectName,
      provideExample: true
    });

    expect(results).toEqual({});
    expect(fs.writeFile).toHaveBeenCalledWith(pathToExample, `const ${camelizedProjectName} = require('.');\n`);
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
      .mockResolvedValue(bundlerResults);
    when(mustache.render)
      .calledWith(exampleTemplateContent, {projectName: camelizedProjectName, esm: false})
      .mockReturnValue(exampleContent);

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
      devDependencies: ['rimraf'],
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
    expect(touch).toHaveBeenCalledWith(`${pathToCreatedSrcDirectory}/index.js`);
    expect(fs.writeFile).toHaveBeenCalledWith(pathToExample, exampleContent);
  });

  it('should not create the example file for a modern-js project when `provideExample` is `false`', async () => {
    const dialect = dialects.BABEL;
    when(scaffoldBundler)
      .calledWith({bundlers: packageBundlers, decisions, projectRoot, dialect, projectType: projectTypes.PACKAGE})
      .mockResolvedValue(bundlerResults);

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
      devDependencies: ['rimraf'],
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
