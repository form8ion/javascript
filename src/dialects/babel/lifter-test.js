import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as ignoreAdder from './config/ignore-adder';
import lift from './lifter';

suite('babel lifter', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(ignoreAdder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the build directory is ignored in the config', async () => {
    const buildDirectory = any.string();

    assert.deepEqual(await lift({buildDirectory}), {});
    assert.calledWith(ignoreAdder.default, {ignore: buildDirectory});
  });
});
