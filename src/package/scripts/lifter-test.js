import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import * as testScriptUpdater from './test-script-updater.js';
import liftScripts from './lifter.js';

suite('package.json lifter', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(testScriptUpdater, 'default');
  });

  teardown(() => sandbox.restore());
  test('that the provided scripts are merged with the existing scripts', async () => {
    const existingScripts = any.simpleObject();
    const scripts = any.simpleObject();
    const updatedScripts = any.simpleObject();
    testScriptUpdater.default.withArgs({...existingScripts, ...scripts}).returns(updatedScripts);

    assert.deepEqual(liftScripts({existingScripts, scripts}), updatedScripts);
  });
});
