import * as eslintPlugin from '@form8ion/eslint';

import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import lift from './lifter';

suite('eslint lifter', () => {
  let sandbox;
  const projectRoot = any.string();
  const liftResults = any.simpleObject();
  const buildDirectory = any.string();
  const eslintConfigs = any.listOf(any.word);
  const modernEslintConfigs = any.listOf(any.word);

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(eslintPlugin, 'lift');
  });

  teardown(() => sandbox.restore());

  test('that the proper details are provided to the lifter from the eslint plugin', async () => {
    const results = {...any.simpleObject(), buildDirectory, eslintConfigs, eslint: {configs: modernEslintConfigs}};

    eslintPlugin.lift
      .withArgs({configs: [...eslintConfigs, ...modernEslintConfigs], projectRoot, buildDirectory})
      .resolves(liftResults);

    assert.equal(await lift({projectRoot, results}), liftResults);
  });

  test('that not providing `eslintConfigs` does not throw an error`', async () => {
    const results = {...any.simpleObject(), buildDirectory, eslint: {configs: modernEslintConfigs}};

    eslintPlugin.lift
      .withArgs({configs: modernEslintConfigs, projectRoot, buildDirectory})
      .resolves(liftResults);

    assert.equal(await lift({projectRoot, results}), liftResults);
  });

  test('that not providing `eslint` does not throw an error`', async () => {
    const results = {...any.simpleObject(), buildDirectory, eslintConfigs};

    eslintPlugin.lift.withArgs({configs: eslintConfigs, projectRoot, buildDirectory}).resolves(liftResults);

    assert.equal(await lift({projectRoot, results}), liftResults);
  });

  test('that `eslint` not containing configs does not throw an error`', async () => {
    const results = {...any.simpleObject(), buildDirectory, eslintConfigs, eslint: {}};

    eslintPlugin.lift.withArgs({configs: eslintConfigs, projectRoot, buildDirectory}).resolves(liftResults);

    assert.equal(await lift({projectRoot, results}), liftResults);
  });
});
