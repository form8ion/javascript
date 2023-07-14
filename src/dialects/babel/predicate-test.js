import core from '@form8ion/core';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import babelExists from './predicate';

suite('babel predicate', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned if a babel config file exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.babelrc.json`).resolves(true);

    assert.isTrue(await babelExists({projectRoot}));
  });

  test('that `false` is returned if a babel config file does not exist', async () => {
    core.fileExists.resolves(false);

    assert.isFalse(await babelExists({projectRoot}));
  });
});
