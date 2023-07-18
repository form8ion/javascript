import prettierPlugin from '@form8ion/prettier';
import eslintPlugin from '@form8ion/eslint';
import deepmerge from 'deepmerge';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

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
  const configureLinting = true;
  const remarkResults = any.simpleObject();
  const eslintResults = any.simpleObject();
  const prettierResults = any.simpleObject();
  const mergedResults = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(eslintPlugin, 'scaffold');
    sandbox.stub(scaffoldRemark, 'default');
    sandbox.stub(prettierPlugin, 'scaffold');
    sandbox.stub(deepmerge, 'all');

    scaffoldRemark.default
      .withArgs({projectRoot, projectType, config: configForRemark, vcs})
      .resolves(remarkResults);
    eslintPlugin.scaffold.withArgs({projectRoot, config: configForEslint}).resolves(eslintResults);
    prettierPlugin.scaffold.withArgs({projectRoot, config: configForPrettier}).resolves(prettierResults);
  });

  teardown(() => sandbox.restore());

  test('that linters are configured when config definitions are provided', async () => {
    deepmerge.all.withArgs([eslintResults, remarkResults, prettierResults]).returns(mergedResults);

    const result = await scaffold({
      projectRoot,
      projectType,
      configs: {eslint: configForEslint, remark: configForRemark, prettier: configForPrettier},
      vcs,
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
      configs: {eslint: configForEslint, remark: configForRemark, prettier: configForPrettier},
      vcs,
      configureLinting: false,
      pathWithinParent
    });

    assert.equal(result, mergedResults);
  });
});
