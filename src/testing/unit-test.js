import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as nyc from '../coverage/nyc';
import * as choiceScaffolder from '../choice-scaffolder';
import * as prompt from './prompt';
import * as optionsValidator from '../options-validator';
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

    sandbox.stub(nyc, 'default');
    sandbox.stub(prompt, 'default');
    sandbox.stub(choiceScaffolder, 'default');
    sandbox.stub(optionsValidator, 'default');

    const validatedFrameworks = any.simpleObject();
    optionsValidator.default.withArgs(unitTestFrameworksSchema, frameworks).returns(validatedFrameworks);
    prompt.default.withArgs({frameworks: validatedFrameworks, decisions}).resolves(chosenFramework);
    choiceScaffolder.default.withArgs(validatedFrameworks, chosenFramework, {projectRoot}).resolves({
      devDependencies: unitTestDevDependencies,
      scripts: unitTestScripts,
      eslintConfigs: unitTestEslintConfigs,
      nextSteps: unitTestNextSteps
    });
  });

  teardown(() => sandbox.restore());

  test('that the chosen framework is scaffolded', async () => {
    const visibility = any.word();
    nyc.default
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
          'test:unit': 'cross-env NODE_ENV=test nyc run-s test:unit:base',
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
    nyc.default
      .withArgs({projectRoot, vcs, visibility})
      .resolves({
        devDependencies: nycDevDependencies,
        vcsIgnore: {files: nycFilesToIgnoreFromVcs, directories: nycDirectoriesToIgnoreFromVcs},
        badges: {status: nycStatusBadges}
      });

    assert.deepEqual(
      await scaffoldUnitTesting({projectRoot, frameworks, decisions, visibility, vcs}),
      {
        devDependencies: ['codecov', ...unitTestDevDependencies, ...nycDevDependencies],
        scripts: {
          'test:unit': 'cross-env NODE_ENV=test nyc run-s test:unit:base',
          ...unitTestScripts,
          'coverage:report': 'nyc report --reporter=text-lcov > coverage.lcov && codecov'
        },
        badges: {status: nycStatusBadges},
        vcsIgnore: {files: nycFilesToIgnoreFromVcs, directories: nycDirectoriesToIgnoreFromVcs},
        eslintConfigs: unitTestEslintConfigs,
        nextSteps: unitTestNextSteps
      }
    );
  });
});
