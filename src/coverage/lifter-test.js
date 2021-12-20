import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as c8Scaffolder from './c8/scaffolder';
import {lift} from './lifter';

suite('lift coverage', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(c8Scaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that `nyc` is replaced by `c8`', async () => {
    const projectRoot = any.string();
    const c8Results = any.simpleObject();
    c8Scaffolder.default.withArgs({projectRoot}).resolves(c8Results);

    assert.equal(await lift({projectRoot}), c8Results);
  });
});
