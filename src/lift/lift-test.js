import * as core from '@form8ion/core';
import * as huskyPlugin from '@form8ion/husky';
import * as commitConventionPlugin from '@form8ion/commit-convention';
import deepmerge from 'deepmerge';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as coveragePlugin from '../coverage';
import * as codeStylePlugin from '../code-style';
import * as enginesEnhancer from './enhancers/engines';
import * as projectTypes from '../project-type/package';
import * as dialects from '../dialects';
import * as packageLifter from '../package/lifter';
import * as packageManagerResolver from './package-manager';
import lift from './lift';

suite('lift', () => {
  let sandbox;
  const projectRoot = any.string();
  const scripts = any.simpleObject();
  const tags = any.listOf(any.word);
  const dependencies = any.listOf(any.word);
  const devDependencies = any.listOf(any.word);
  const packageManager = any.word();
  const manager = any.word();
  const enhancerResults = any.simpleObject();
  const vcsDetails = any.simpleObject();
  const results = {...any.simpleObject(), scripts, tags, dependencies, devDependencies, packageManager: manager};

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(packageLifter, 'default');
    sandbox.stub(packageManagerResolver, 'default');
    sandbox.stub(core, 'applyEnhancers');

    packageManagerResolver.default.withArgs({projectRoot, packageManager: manager}).resolves(packageManager);
  });

  teardown(() => sandbox.restore());

  test('that results specific to js projects are lifted', async () => {
    core.applyEnhancers
      .withArgs({
        results,
        enhancers: [
          huskyPlugin,
          enginesEnhancer,
          coveragePlugin,
          commitConventionPlugin,
          dialects,
          codeStylePlugin,
          projectTypes
        ],
        options: {projectRoot, packageManager, vcs: vcsDetails}
      })
      .resolves(enhancerResults);

    const liftResults = await lift({projectRoot, vcs: vcsDetails, results});

    assert.deepEqual(liftResults, enhancerResults);
    assert.calledWith(
      packageLifter.default,
      deepmerge.all([{projectRoot, scripts, tags, dependencies, devDependencies, packageManager}, enhancerResults])
    );
  });
});
