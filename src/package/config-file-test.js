import * as core from '@form8ion/core';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import {write, mergeIntoExisting} from './config-file';

suite('package.json config', () => {
  let sandbox;
  const projectRoot = any.string();
  const config = any.simpleObject;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'writeConfigFile');
    sandbox.stub(core, 'mergeIntoExistingConfigFile');
  });

  teardown(() => sandbox.restore());

  test('that the provided config is written', async () => {
    await write({projectRoot, config});

    assert.calledWith(core.writeConfigFile, {format: core.fileTypes.JSON, name: 'package', path: projectRoot, config});
  });

  test('that the provided config is merged into the existing file', async () => {
    await mergeIntoExisting({projectRoot, config});

    assert.calledWith(
      core.mergeIntoExistingConfigFile,
      {format: core.fileTypes.JSON, name: 'package', path: projectRoot, config}
    );
  });
});
