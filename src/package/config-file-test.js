import * as core from '@form8ion/core';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import {write} from './config-file';

suite('package.json config', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'writeConfigFile');
  });

  teardown(() => sandbox.restore());
  test('that the provided config is written', async () => {
    const projectRoot = any.string();
    const config = any.simpleObject;

    await write({projectRoot, config});

    assert.calledWith(core.writeConfigFile, {format: core.fileTypes.JSON, name: 'package', path: projectRoot, config});
  });
});
