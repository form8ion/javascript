import * as core from '@form8ion/core';
import * as eslintPlugin from '@form8ion/eslint';
import * as huskyPlugin from '@form8ion/husky';
import * as commitConventionPlugin from '@form8ion/commit-convention';
import deepmerge from 'deepmerge';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as coveragePlugin from '../coverage';
import * as enginesEnhancer from './enhancers/engines';
import * as packageLifter from '../package/lifter';
import * as packageManagerResolver from './package-manager';
import lift from './lift';

suite('lift', () => {
  let sandbox;
  const projectRoot = any.string();
  const scripts = any.simpleObject();
  const tags = any.listOf(any.word);
  const eslintConfigs = any.listOf(any.word);
  const modernEslintConfigs = any.listOf(any.word);
  const dependencies = any.listOf(any.word);
  const devDependencies = any.listOf(any.word);
  const packageManager = any.word();
  const manager = any.word();
  const scope = any.word();
  const eslintLiftResults = {...any.simpleObject(), devDependencies: any.listOf(any.word)};
  const enhancerResults = any.simpleObject();
  const vcsDetails = any.simpleObject();
  const results = {
    ...any.simpleObject(),
    scripts,
    tags,
    dependencies,
    devDependencies,
    packageManager: manager
  };

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(packageLifter, 'default');
    sandbox.stub(eslintPlugin, 'lift');
    sandbox.stub(packageManagerResolver, 'default');
    sandbox.stub(core, 'applyEnhancers');

    packageManagerResolver.default.withArgs({projectRoot, packageManager: manager}).resolves(packageManager);
  });

  teardown(() => sandbox.restore());

  test('that results specific to js projects are lifted', async () => {
    const enhancedResults = {...results, eslintConfigs, eslint: {configs: modernEslintConfigs}};
    eslintPlugin.lift
      .withArgs({configs: [...eslintConfigs, ...modernEslintConfigs], projectRoot})
      .resolves(eslintLiftResults);
    core.applyEnhancers
      .withArgs({
        results: enhancedResults,
        enhancers: [huskyPlugin, enginesEnhancer, coveragePlugin, commitConventionPlugin],
        options: {projectRoot, packageManager, vcs: vcsDetails}
      })
      .resolves(enhancerResults);

    const liftResults = await lift({
      projectRoot,
      vcs: vcsDetails,
      configs: {eslint: {scope}},
      results: enhancedResults
    });

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

  test('that not providing `eslintConfigs` does not throw an error`', async () => {
    const enhancedResults = {...results, eslint: {configs: modernEslintConfigs}};
    eslintPlugin.lift
      .withArgs({configs: modernEslintConfigs, projectRoot})
      .resolves(eslintLiftResults);
    core.applyEnhancers
      .withArgs({
        results: enhancedResults,
        enhancers: [huskyPlugin, enginesEnhancer, coveragePlugin, commitConventionPlugin],
        options: {projectRoot, packageManager, vcs: vcsDetails}
      })
      .resolves(enhancerResults);

    await lift({
      projectRoot,
      vcs: vcsDetails,
      configs: {eslint: {scope}},
      results: enhancedResults
    });

    assert.calledWith(
      packageLifter.default,
      deepmerge.all([
        {projectRoot, scripts, tags, dependencies, devDependencies, packageManager},
        eslintLiftResults,
        enhancerResults
      ])
    );
  });

  test('that not providing `eslint` does not throw an error`', async () => {
    const enhancedResults = {...results, eslintConfigs};
    eslintPlugin.lift
      .withArgs({configs: eslintConfigs, projectRoot})
      .resolves(eslintLiftResults);
    core.applyEnhancers
      .withArgs({
        results: enhancedResults,
        enhancers: [huskyPlugin, enginesEnhancer, coveragePlugin, commitConventionPlugin],
        options: {projectRoot, packageManager, vcs: vcsDetails}
      })
      .resolves(enhancerResults);

    await lift({
      projectRoot,
      vcs: vcsDetails,
      configs: {eslint: {scope}},
      results: enhancedResults
    });

    assert.calledWith(
      packageLifter.default,
      deepmerge.all([
        {projectRoot, scripts, tags, dependencies, devDependencies, packageManager},
        eslintLiftResults,
        enhancerResults
      ])
    );
  });

  test('that `eslint` not containing configs does not throw an error`', async () => {
    const enhancedResults = {...results, eslintConfigs, eslint: {}};
    eslintPlugin.lift
      .withArgs({configs: eslintConfigs, projectRoot})
      .resolves(eslintLiftResults);
    core.applyEnhancers
      .withArgs({
        results: enhancedResults,
        enhancers: [huskyPlugin, enginesEnhancer, coveragePlugin, commitConventionPlugin],
        options: {projectRoot, packageManager, vcs: vcsDetails}
      })
      .resolves(enhancerResults);

    await lift({
      projectRoot,
      vcs: vcsDetails,
      configs: {eslint: {scope}},
      results: enhancedResults
    });

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
