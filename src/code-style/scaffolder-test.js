import deepmerge from 'deepmerge';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as scaffoldEslint from './eslint';
import * as scaffoldRemark from './remark';
import {scaffold} from '.';

suite('code-style scaffolder', () => {
  let sandbox;
  const pathWithinParent = any.string();
  const projectRoot = any.string();
  const projectType = any.word();
  const configForEslint = any.simpleObject();
  const vcs = any.simpleObject();
  const remarkDevDependencies = any.listOf(any.string);
  const remarkScripts = any.simpleObject();
  const configForRemark = any.simpleObject();
  const buildDirectory = any.string();
  const eslintConfigs = any.listOf(any.word);
  const configureLinting = true;
  const dialect = any.word();
  const remarkResults = any.simpleObject();
  const eslintResults = any.simpleObject();
  const mergedResults = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffoldEslint, 'default');
    sandbox.stub(scaffoldRemark, 'default');
    sandbox.stub(deepmerge, 'all');

    scaffoldRemark.default
      .withArgs({projectRoot, projectType, config: configForRemark, vcs, dialect})
      .resolves(remarkResults);
    scaffoldEslint.default
      .withArgs({
        projectRoot,
        config: configForEslint,
        buildDirectory,
        additionalConfiguration: {configs: eslintConfigs}
      })
      .resolves(eslintResults);
  });

  teardown(() => sandbox.restore());

  test('that linters are configured when config definitions are provided', async () => {
    deepmerge.all.withArgs([eslintResults, remarkResults]).returns(mergedResults);

    const result = await scaffold({
      projectRoot,
      projectType,
      dialect,
      configs: {eslint: configForEslint, remark: configForRemark},
      vcs,
      buildDirectory,
      eslint: {configs: eslintConfigs},
      configureLinting,
      pathWithinParent
    });

    assert.equal(result, mergedResults);
  });

  test('that eslint is not scaffolded when a config is not defined', async () => {
    deepmerge.all.withArgs([remarkResults]).returns(mergedResults);

    const result = await scaffold({
      projectRoot,
      projectType,
      dialect,
      configs: {remark: configForRemark},
      vcs,
      configureLinting,
      pathWithinParent
    });

    assert.equal(result, mergedResults);
  });

  test('that eslint is not scaffolded when `transpileLint` is false', async () => {
    deepmerge.all.withArgs([remarkResults]).returns(mergedResults);

    scaffoldRemark.default
      .withArgs({projectRoot, projectType, config: configForRemark, vcs, configureLinting: false})
      .resolves({devDependencies: remarkDevDependencies, scripts: remarkScripts});

    const result = await scaffold({
      projectRoot,
      projectType,
      dialect,
      configs: {eslint: configForEslint, remark: configForRemark},
      vcs,
      configureLinting: false,
      pathWithinParent
    });

    assert.equal(result, mergedResults);
  });
});
