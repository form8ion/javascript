import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as configWriter from './config/writer.js';
import scaffoldBabel from './scaffolder.js';

suite('babel config', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(configWriter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the babelrc is written if a preset is defined', async () => {
    const babelPresetName = any.string();
    const babelPresetPackageName = any.word();
    const babelPreset = {name: babelPresetName, packageName: babelPresetPackageName};

    assert.deepEqual(
      await scaffoldBabel({preset: babelPreset, projectRoot, tests: {unit: true}}),
      {devDependencies: ['@babel/register', babelPresetPackageName], eslint: {}}
    );

    assert.calledWith(
      configWriter.default,
      {projectRoot, config: {presets: [babelPresetName]}}
    );
  });

  test('that an error is thrown if a preset is not defined', async () => {
    try {
      await scaffoldBabel({preset: undefined, projectRoot});

      throw new Error('test should have failed, but didnt');
    } catch (e) {
      assert.notCalled(configWriter.default);
      assert.equal(e.message, 'No babel preset provided. Cannot configure babel transpilation');
    }
  });
});
