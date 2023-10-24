import jsCore from '@form8ion/javascript-core';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as packageChooser from './prompt.js';
import scaffold from './scaffolder.js';

suite('chosen project-type plugin scaffolder', () => {
  let sandbox;
  const chosenType = any.word();
  const projectRoot = any.string();
  const packageManager = any.word();
  const projectName = any.word();
  const packageName = any.word();
  const projectType = any.word();
  const scope = any.word();
  const tests = any.simpleObject();
  const decisions = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(packageChooser, 'default');
    sandbox.stub(jsCore, 'scaffoldChoice');
  });

  teardown(() => sandbox.restore());

  test('that a plugin can be chosen and is then scaffolded', async () => {
    const typeScaffoldingResults = any.simpleObject();
    const pluginsForProjectType = any.simpleObject();
    const dialect = any.word();
    const plugins = {...any.simpleObject(), [projectType]: pluginsForProjectType};
    packageChooser.default.withArgs({types: pluginsForProjectType, decisions, projectType}).returns(chosenType);
    jsCore.scaffoldChoice
      .withArgs(
        pluginsForProjectType,
        chosenType,
        {projectRoot, packageManager, projectName, packageName, tests, scope, dialect}
      )
      .resolves(typeScaffoldingResults);

    assert.equal(
      await scaffold({
        projectRoot,
        projectType,
        projectName,
        packageName,
        packageManager,
        tests,
        scope,
        dialect,
        decisions,
        plugins
      }),
      typeScaffoldingResults
    );
  });

  test('that no plugin is scaffolded if none are defined for the project type', async () => {
    const results = await scaffold({
      projectRoot,
      projectType,
      projectName,
      packageName,
      packageManager,
      tests,
      scope,
      decisions,
      plugins: any.simpleObject()
    });

    assert.notCalled(packageChooser.default);
    assert.deepEqual(results, {});
  });
});
