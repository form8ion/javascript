import * as eslintPlugin from '@form8ion/eslint';
import * as huskyPlugin from '@form8ion/husky';
import deepmerge from 'deepmerge';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as coveragePlugin from '../coverage';
import * as enhancers from './enhancers/apply';
import * as enginesEnhancer from './enhancers/engines';
import * as packageLifter from './package';
import * as packageManagerResolver from './package-manager';
import lift from './lift';

suite('lift', () => {
  let sandbox;
  const projectRoot = any.string();
  const scripts = any.simpleObject();
  const tags = any.listOf(any.word);
  const eslintConfigs = any.listOf(any.word);
  const dependencies = any.listOf(any.word);
  const devDependencies = any.listOf(any.word);
  const packageManager = any.word();
  const manager = any.word();
  const results = {
    ...any.simpleObject(),
    scripts,
    tags,
    eslintConfigs,
    dependencies,
    devDependencies,
    packageManager: manager
  };

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(packageLifter, 'default');
    sandbox.stub(eslintPlugin, 'lift');
    sandbox.stub(packageManagerResolver, 'default');
    sandbox.stub(enhancers, 'default');

    packageManagerResolver.default.withArgs({projectRoot, packageManager: manager}).resolves(packageManager);
  });

  teardown(() => sandbox.restore());

  test('that results specific to js projects are lifted', async () => {
    const scope = any.word();
    const eslintLiftResults = {...any.simpleObject(), devDependencies: any.listOf(any.word)};
    const enhancerResults = any.simpleObject();
    eslintPlugin.lift.withArgs({configs: eslintConfigs, projectRoot}).resolves(eslintLiftResults);
    enhancers.default
      .withArgs({
        results,
        enhancers: [huskyPlugin, enginesEnhancer, coveragePlugin],
        options: {projectRoot, packageManager}
      })
      .resolves(enhancerResults);

    const liftResults = await lift({projectRoot, results, configs: {eslint: {scope}}});

    assert.deepEqual(liftResults, enhancerResults);
    assert.calledWith(
      packageLifter.default,
      deepmerge.all([
        {projectRoot, scripts, tags, dependencies, devDependencies, packageManager},
        eslintLiftResults,
        enhancerResults
      ])
    );
  });
});
