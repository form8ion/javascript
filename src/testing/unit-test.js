import * as jsCore from '@form8ion/javascript-core';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as coverageScaffolder from '../coverage/scaffolder';
import * as prompt from './prompt';
import {unitTestFrameworksSchema} from './options-schemas';
import scaffoldUnitTesting from './unit';

suite('unit testing scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const unitTestDevDependencies = any.listOf(any.string);
  const unitTestScripts = any.simpleObject();
  const unitTestEslintConfigs = any.listOf(any.string);
  const unitTestNextSteps = any.listOf(any.simpleObject);
  const nycDevDependencies = any.listOf(any.string);
  const nycFilesToIgnoreFromVcs = any.listOf(any.string);
  const nycDirectoriesToIgnoreFromVcs = any.listOf(any.string);
  const vcs = any.simpleObject();
  const frameworks = any.simpleObject();
  const decisions = any.simpleObject();
  const chosenFramework = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(coverageScaffolder, 'default');
    sandbox.stub(prompt, 'default');
    sandbox.stub(jsCore, 'scaffoldChoice');
    sandbox.stub(jsCore, 'validateOptions');

    const validatedFrameworks = any.simpleObject();
    jsCore.validateOptions.withArgs(unitTestFrameworksSchema, frameworks).returns(validatedFrameworks);
    prompt.default.withArgs({frameworks: validatedFrameworks, decisions}).resolves(chosenFramework);
    jsCore.scaffoldChoice.withArgs(validatedFrameworks, chosenFramework, {projectRoot}).resolves({
      devDependencies: unitTestDevDependencies,
      scripts: unitTestScripts,
      eslintConfigs: unitTestEslintConfigs,
      nextSteps: unitTestNextSteps
    });
  });

  teardown(() => sandbox.restore());

  test('that the chosen framework is scaffolded', async () => {
    const visibility = any.word();
    coverageScaffolder.default
      .withArgs({projectRoot, vcs, visibility})
      .resolves({
        devDependencies: nycDevDependencies,
        vcsIgnore: {files: nycFilesToIgnoreFromVcs, directories: nycDirectoriesToIgnoreFromVcs}
      });

    assert.deepEqual(
      await scaffoldUnitTesting({projectRoot, frameworks, decisions, vcs, visibility}),
      {
        devDependencies: [...unitTestDevDependencies, ...nycDevDependencies],
        scripts: {
          'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base',
          ...unitTestScripts
        },
        vcsIgnore: {files: nycFilesToIgnoreFromVcs, directories: nycDirectoriesToIgnoreFromVcs},
        eslintConfigs: unitTestEslintConfigs,
        nextSteps: unitTestNextSteps
      }
    );
  });

  test('that codecov is installed for public projects', async () => {
    const visibility = 'Public';
    const nycStatusBadges = any.simpleObject();
    coverageScaffolder.default
      .withArgs({projectRoot, vcs, visibility})
      .resolves({
        devDependencies: nycDevDependencies,
        vcsIgnore: {files: nycFilesToIgnoreFromVcs, directories: nycDirectoriesToIgnoreFromVcs},
        badges: {status: nycStatusBadges}
      });

    assert.deepEqual(
      await scaffoldUnitTesting({projectRoot, frameworks, decisions, visibility, vcs}),
      {
        devDependencies: [...unitTestDevDependencies, ...nycDevDependencies],
        scripts: {
          'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base',
          ...unitTestScripts
        },
        badges: {status: nycStatusBadges},
        vcsIgnore: {files: nycFilesToIgnoreFromVcs, directories: nycDirectoriesToIgnoreFromVcs},
        eslintConfigs: unitTestEslintConfigs,
        nextSteps: unitTestNextSteps
      }
    );
  });
});
