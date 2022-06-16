import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as scaffoldEslint from './eslint';
import * as scaffoldRemark from './remark';
import {scaffold} from '.';

suite('code-style scaffolder', () => {
  let sandbox;
  const eslintDevDependencies = any.listOf(any.string);
  const eslintFilesIgnoredFromVcs = any.listOf(any.string);
  const pathWithinParent = any.string();
  const projectRoot = any.string();
  const projectType = any.word();
  const configForEslint = any.simpleObject();
  const eslintScripts = any.simpleObject();
  const vcs = any.simpleObject();
  const remarkDevDependencies = any.listOf(any.string);
  const remarkScripts = any.simpleObject();
  const configForRemark = any.simpleObject();
  const buildDirectory = any.string();
  const eslintConfigs = any.listOf(any.word);
  const configureLinting = true;
  const dialect = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffoldEslint, 'default');
    sandbox.stub(scaffoldRemark, 'default');

    scaffoldRemark.default
      .withArgs({projectRoot, projectType, config: configForRemark, vcs, dialect})
      .resolves({devDependencies: remarkDevDependencies, scripts: remarkScripts});
    scaffoldEslint.default
      .withArgs({
        projectRoot,
        config: configForEslint,
        buildDirectory,
        additionalConfiguration: {configs: eslintConfigs}
      })
      .resolves({
        devDependencies: eslintDevDependencies,
        vcsIgnore: {files: eslintFilesIgnoredFromVcs},
        scripts: eslintScripts
      });
  });

  teardown(() => sandbox.restore());

  test('that linters are configured when config definitions are provided', async () => {
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

    assert.deepEqual(result.devDependencies, [...eslintDevDependencies, ...remarkDevDependencies]);
    assert.deepEqual(result.vcsIgnore.files, eslintFilesIgnoredFromVcs);
    assert.deepEqual(result.scripts, {...eslintScripts, ...remarkScripts});
  });

  test('that eslint is not scaffolded when a config is not defined', async () => {
    const result = await scaffold({
      projectRoot,
      projectType,
      dialect,
      configs: {remark: configForRemark},
      vcs,
      configureLinting,
      pathWithinParent
    });

    assert.deepEqual(result.devDependencies, remarkDevDependencies);
    assert.deepEqual(result.scripts, remarkScripts);
  });

  test('that eslint is not scaffolded when `transpileLint` is false', async () => {
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

    assert.deepEqual(result.devDependencies, remarkDevDependencies);
    assert.deepEqual(result.scripts, remarkScripts);
  });
});
