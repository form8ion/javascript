import {promises as fsPromises, promises as fs} from 'fs';
import mustache from 'mustache';
import jsCore from '@form8ion/javascript-core';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as touch from '../../../thirdparty-wrappers/touch';
import * as mkdir from '../../../thirdparty-wrappers/make-dir';
import * as camelcase from '../../../thirdparty-wrappers/camelcase';
import * as templatePath from '../../template-path';
import * as bundlerPrompt from './prompt';
import buildDetails from './build-details';

suite('package build details', () => {
  let sandbox;
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

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'writeFile');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(touch, 'default');
    sandbox.stub(mkdir, 'default');
    sandbox.stub(templatePath, 'default');
    sandbox.stub(jsCore, 'scaffoldChoice');
    sandbox.stub(mustache, 'render');
    sandbox.stub(camelcase, 'default');
    sandbox.stub(bundlerPrompt, 'default');

    mkdir.default.withArgs(`${projectRoot}/src`).resolves(pathToCreatedSrcDirectory);
    templatePath.default.withArgs('example.mustache').returns(pathToExampleTemplate);
    fsPromises.readFile.withArgs(pathToExampleTemplate, 'utf8').resolves(exampleTemplateContent);
    camelcase.default.withArgs(projectName).returns(camelizedProjectName);
    mustache.render.withArgs(exampleTemplateContent, {projectName: camelizedProjectName}).returns(exampleContent);
  });

  teardown(() => sandbox.restore());

  test('that common-js project is defined correctly', async () => {
    const results = await buildDetails({
      dialect: jsCore.dialects.COMMON_JS,
      projectRoot,
      projectName,
      provideExample: true
    });

    assert.deepEqual(results, {});
    assert.calledWith(fsPromises.writeFile, pathToExample, `const ${camelizedProjectName} = require('.');\n`);
    assert.calledWith(touch.default, `${projectRoot}/index.js`);
  });

  test('that the example file is not created for a common-js project if `provideExample` is false', async () => {
    await buildDetails({
      dialect: jsCore.dialects.COMMON_JS,
      projectRoot,
      projectName,
      provideExample: false
    });

    assert.notCalled(fsPromises.writeFile);
  });

  test('that a modern-js project is defined correctly', async () => {
    const dialect = jsCore.dialects.BABEL;
    const chosenBundler = any.word();
    bundlerPrompt.default.withArgs({bundlers: packageBundlers, decisions}).resolves(chosenBundler);
    jsCore.scaffoldChoice
      .withArgs(packageBundlers, chosenBundler, {projectRoot, dialect, projectType: jsCore.projectTypes.PACKAGE})
      .resolves(bundlerResults);

    const results = await buildDetails({
      dialect,
      projectRoot,
      projectName,
      packageBundlers,
      decisions,
      provideExample: true
    });

    assert.deepEqual(
      results,
      {
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
      }
    );
    assert.calledWith(touch.default, `${pathToCreatedSrcDirectory}/index.js`);
    assert.calledWith(fsPromises.writeFile, pathToExample, exampleContent);
  });

  test('that the example file is not created for a modern-js project when `provideExample` is false', async () => {
    const dialect = jsCore.dialects.BABEL;
    const chosenBundler = any.word();
    bundlerPrompt.default.withArgs({bundlers: packageBundlers, decisions}).resolves(chosenBundler);
    jsCore.scaffoldChoice
      .withArgs(packageBundlers, chosenBundler, {projectRoot, dialect, projectType: jsCore.projectTypes.PACKAGE})
      .resolves(bundlerResults);

    const results = await buildDetails({
      dialect,
      projectRoot,
      projectName,
      packageBundlers,
      decisions,
      provideExample: false
    });

    assert.deepEqual(
      results,
      {
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
      }
    );
    assert.notCalled(fsPromises.writeFile);
  });

  test('that the runkit badge is included for public projects', async () => {
    const packageName = any.word();

    const {badges} = await buildDetails({
      dialect: jsCore.dialects.BABEL,
      projectRoot,
      projectName,
      packageName,
      visibility: 'Public'
    });

    assert.deepEqual(
      badges.consumer.runkit,
      {
        img: `https://badge.runkitcdn.com/${packageName}.svg`,
        text: `Try ${packageName} on RunKit`,
        link: `https://npm.runkit.com/${packageName}`
      }
    );
  });
});
