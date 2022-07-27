import * as prettierPlugin from '@form8ion/prettier';
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
  const configForPrettier = any.simpleObject();
  const vcs = any.simpleObject();
  const remarkDevDependencies = any.listOf(any.string);
  const remarkScripts = any.simpleObject();
  const configForRemark = any.simpleObject();
  const eslintConfigs = any.listOf(any.word);
  const configureLinting = true;
  const dialect = any.word();
  const remarkResults = any.simpleObject();
  const eslintResults = any.simpleObject();
  const prettierResults = any.simpleObject();
  const mergedResults = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffoldEslint, 'default');
    sandbox.stub(scaffoldRemark, 'default');
    sandbox.stub(prettierPlugin, 'scaffold');
    sandbox.stub(deepmerge, 'all');

    scaffoldRemark.default
      .withArgs({projectRoot, projectType, config: configForRemark, vcs, dialect})
      .resolves(remarkResults);
    scaffoldEslint.default
      .withArgs({projectRoot, config: configForEslint, additionalConfiguration: {configs: eslintConfigs}})
      .resolves(eslintResults);
    prettierPlugin.scaffold.withArgs({projectRoot, config: configForPrettier}).resolves(prettierResults);
  });

  teardown(() => sandbox.restore());

  test('that linters are configured when config definitions are provided', async () => {
    deepmerge.all.withArgs([eslintResults, remarkResults, prettierResults]).returns(mergedResults);

    const result = await scaffold({
      projectRoot,
      projectType,
      dialect,
      configs: {eslint: configForEslint, remark: configForRemark, prettier: configForPrettier},
      vcs,
      eslint: {configs: eslintConfigs},
      configureLinting,
      pathWithinParent
    });

    assert.equal(result, mergedResults);
  });

  test('that eslint is not scaffolded when a config is not defined', async () => {
    deepmerge.all.withArgs([remarkResults, prettierResults]).returns(mergedResults);

    const result = await scaffold({
      projectRoot,
      projectType,
      dialect,
      configs: {remark: configForRemark, prettier: configForPrettier},
      vcs,
      configureLinting,
      pathWithinParent
    });

    assert.equal(result, mergedResults);
  });

  test('that eslint is not scaffolded when `transpileLint` is false', async () => {
    deepmerge.all.withArgs([remarkResults, prettierResults]).returns(mergedResults);

    scaffoldRemark.default
      .withArgs({projectRoot, projectType, config: configForRemark, vcs, configureLinting: false})
      .resolves({devDependencies: remarkDevDependencies, scripts: remarkScripts});

    const result = await scaffold({
      projectRoot,
      projectType,
      dialect,
      configs: {eslint: configForEslint, remark: configForRemark, prettier: configForPrettier},
      vcs,
      configureLinting: false,
      pathWithinParent
    });

    assert.equal(result, mergedResults);
  });
});
