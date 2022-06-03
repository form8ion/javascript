import {fileTypes} from '@form8ion/core';
import * as configFile from '@form8ion/config-file';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import scaffoldBabel from './scaffolder';

suite('babel config', () => {
  let sandbox;
  const projectRoot = any.string();
  const buildDirectory = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(configFile, 'write');
  });

  teardown(() => sandbox.restore());

  test('that the babelrc is written if a preset is defined', async () => {
    const babelPresetName = any.string();
    const babelPresetPackageName = any.word();
    const babelPreset = {name: babelPresetName, packageName: babelPresetPackageName};

    assert.deepEqual(
      await scaffoldBabel({preset: babelPreset, projectRoot, tests: {unit: true}, buildDirectory}),
      {devDependencies: ['@babel/register', babelPresetPackageName], eslint: {}}
    );

    assert.calledWith(
      configFile.write,
      {
        path: projectRoot,
        name: 'babel',
        format: fileTypes.JSON,
        config: {presets: [babelPresetName], ignore: [`./${buildDirectory}/`]}
      }
    );
  });

  test('that an error is thrown if a preset is not defined', async () => {
    try {
      await scaffoldBabel({preset: undefined, projectRoot});

      throw new Error('test should have failed, but didnt');
    } catch (e) {
      assert.notCalled(configFile.write);
      assert.equal(e.message, 'No babel preset provided. Cannot configure babel transpilation');
    }
  });
});
