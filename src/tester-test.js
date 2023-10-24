import core from '@form8ion/core';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import testApplicability from './tester.js';

suite('applicability test', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');

    core.fileExists.returns(false);
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned if the project has an `.nvmrc` file', async () => {
    core.fileExists.withArgs(`${projectRoot}/.nvmrc`).returns(true);

    assert.isTrue(await testApplicability({projectRoot}));
  });

  test('that `true` is returned if the project has an `package-lock.json` file', async () => {
    core.fileExists.withArgs(`${projectRoot}/package-lock.json`).returns(true);

    assert.isTrue(await testApplicability({projectRoot}));
  });

  test('that `true` is returned if the project has an `yarn.lock` file', async () => {
    core.fileExists.withArgs(`${projectRoot}/yarn.lock`).returns(true);

    assert.isTrue(await testApplicability({projectRoot}));
  });

  test('that `false` is returned if the project\'s `.nvmrc` is not file', async () => {
    assert.isFalse(await testApplicability({projectRoot}));
  });
});
