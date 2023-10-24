import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';

import * as execa from '../../thirdparty-wrappers/execa.js';
import removeDependencies from './remover.js';

suite('dependency remover', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(execa, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the package manager is used to remove the provided list of dependencies', async () => {
    const packageManager = any.word();
    const dependencies = any.listOf(any.word);

    await removeDependencies({packageManager, dependencies});

    assert.calledWith(execa.default, packageManager, ['remove', ...dependencies]);
  });
});
