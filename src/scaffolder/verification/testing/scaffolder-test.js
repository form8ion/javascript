import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as unitTestingScaffolder from '../../../testing/unit.js';
import scaffoldTesting from './scaffolder.js';

suite('testing scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const visibility = any.word();
  const dialect = any.word();
  const unitTestingDevDependencies = any.listOf(any.string);
  const unitTestNextSteps = any.listOf(any.simpleObject);
  const unitTestScripts = any.simpleObject();
  const unitTestFilesToIgnoreFromVcs = any.listOf(any.string);
  const unitTestDirectoriesToIgnoreFromVcs = any.listOf(any.string);
  const vcs = any.simpleObject();
  const unitTestFrameworks = any.simpleObject();
  const decisions = any.simpleObject();
  const pathWithinParent = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(unitTestingScaffolder, 'default');

    unitTestingScaffolder.default
      .withArgs({projectRoot, visibility, vcs, frameworks: unitTestFrameworks, decisions, dialect, pathWithinParent})
      .resolves({
        devDependencies: unitTestingDevDependencies,
        scripts: unitTestScripts,
        vcsIgnore: {files: unitTestFilesToIgnoreFromVcs, directories: unitTestDirectoriesToIgnoreFromVcs},
        nextSteps: unitTestNextSteps
      });
  });

  teardown(() => sandbox.restore());

  test('that unit testing is scaffolded if the project will be unit tested', async () => {
    assert.deepEqual(
      await scaffoldTesting({
        projectRoot,
        visibility,
        tests: {unit: true},
        vcs,
        unitTestFrameworks,
        decisions,
        dialect,
        pathWithinParent
      }),
      {
        devDependencies: ['@travi/any', ...unitTestingDevDependencies],
        scripts: unitTestScripts,
        vcsIgnore: {files: unitTestFilesToIgnoreFromVcs, directories: unitTestDirectoriesToIgnoreFromVcs},
        eslint: {},
        nextSteps: unitTestNextSteps
      }
    );
  });

  test('that unit testing is not scaffolded if the project will not be unit tested', async () => {
    assert.deepEqual(
      await scaffoldTesting({projectRoot, visibility, tests: {unit: false, integration: true}, pathWithinParent}),
      {devDependencies: ['@travi/any'], eslint: {}}
    );
  });

  test('that testing is not scaffolded if the project will not be tested', async () => {
    assert.deepEqual(
      await scaffoldTesting({projectRoot, visibility, tests: {unit: false, integration: false}, pathWithinParent}),
      {devDependencies: [], eslint: {}}
    );
  });
});
