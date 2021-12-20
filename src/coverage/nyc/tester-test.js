import * as core from '@form8ion/core';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import nycIsConfigured from './tester';

suite('nyc predicate', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned if the config file exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.nycrc`).resolves(true);

    assert.isTrue(await nycIsConfigured({projectRoot}));
  });

  test('that `false` is returned if the config file does not exist', async () => {
    core.fileExists.withArgs(`${projectRoot}/.nycrc`).resolves(false);

    assert.isFalse(await nycIsConfigured({projectRoot}));
  });
});
