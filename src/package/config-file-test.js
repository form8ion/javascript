import {promises as fs} from 'fs';
import deepmerge from 'deepmerge';
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
    sandbox.stub(fs, 'readFile');
    sandbox.stub(deepmerge, 'all');
  });

  teardown(() => sandbox.restore());

  test('that the provided config is written', async () => {
    await write({projectRoot, config});

    assert.calledWith(core.writeConfigFile, {format: core.fileTypes.JSON, name: 'package', path: projectRoot, config});
  });

  test('that the provided config is merged into the existing file', async () => {
    const existingConfig = any.simpleObject();
    const mergedConfig = any.simpleObject();
    fs.readFile.withArgs(`${projectRoot}/package.json`, 'utf-8').resolves(JSON.stringify(existingConfig));
    deepmerge.all.withArgs([existingConfig, config]).returns(mergedConfig);

    await mergeIntoExisting({projectRoot, config});

    assert.calledWith(
      core.writeConfigFile,
      {format: core.fileTypes.JSON, name: 'package', path: projectRoot, config: mergedConfig}
    );
  });
});
