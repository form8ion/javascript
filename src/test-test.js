import * as core from '@form8ion/core';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import testApplicability from './test';

suite('applicability test', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned if the project has an `.nvmrc` file', async () => {
    const projectRoot = any.string();
    core.fileExists.withArgs(`${projectRoot}/.nvmrc`).returns(true);

    assert.isTrue(await testApplicability({projectRoot}));
  });

  test('that `false` is returned if the project\'s `.nvmrc` is not file', async () => {
    const projectRoot = any.string();
    core.fileExists.withArgs(`${projectRoot}/.nvmrc`).returns(false);

    assert.isFalse(await testApplicability({projectRoot}));
  });
});
