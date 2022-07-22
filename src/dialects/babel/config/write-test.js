import {fileTypes} from '@form8ion/core';
import * as configFile from '@form8ion/config-file';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import write from './write';

suite('write babel config', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(configFile, 'write');
  });

  teardown(() => sandbox.restore());

  test('that the provided config is written to the rc file', async () => {
    const projectRoot = any.string();
    const config = any.simpleObject();

    await write({projectRoot, config});

    assert.calledWith(configFile.write, {path: projectRoot, name: 'babel', format: fileTypes.JSON, config});
  });
});
