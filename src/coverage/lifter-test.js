import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as nycTester from './nyc/tester';
import * as nycRemover from './nyc/remover';
import * as c8Scaffolder from './c8/scaffolder';
import {lift} from './lifter';

suite('lift coverage', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(c8Scaffolder, 'default');
    sandbox.stub(nycTester, 'default');
    sandbox.stub(nycRemover, 'default');
  });

  teardown(() => sandbox.restore());

  test('that `nyc` is replaced by `c8` if nyc config exists', async () => {
    const projectRoot = any.string();
    const c8Results = any.simpleObject();
    c8Scaffolder.default.withArgs({projectRoot}).resolves(c8Results);
    nycTester.default.withArgs({projectRoot}).resolves(true);

    assert.equal(await lift({projectRoot}), c8Results);

    assert.calledWith(nycRemover.default, {projectRoot});
  });

  test('that `nyc` is not replaced by `c8` if nyc config does not exist', async () => {
    const projectRoot = any.string();
    const c8Results = any.simpleObject();
    c8Scaffolder.default.withArgs({projectRoot}).resolves(c8Results);
    nycTester.default.withArgs({projectRoot}).resolves(false);

    assert.deepEqual(await lift({projectRoot}), {});

    assert.notCalled(c8Scaffolder.default);
  });
});
