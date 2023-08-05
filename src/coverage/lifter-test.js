import deepmerge from 'deepmerge';
import * as codecovPlugin from '@form8ion/codecov';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as nycTester from './nyc/tester';
import * as nycRemover from './nyc/remover';
import * as c8Scaffolder from './c8/scaffolder';
import {lift} from './lifter';

suite('lift coverage', () => {
  let sandbox;
  const projectRoot = any.string();
  const c8Results = any.simpleObject();
  const codecovResults = any.simpleObject();
  const packageManager = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(c8Scaffolder, 'default');
    sandbox.stub(nycTester, 'default');
    sandbox.stub(nycRemover, 'default');
    sandbox.stub(deepmerge, 'all');
    sandbox.stub(codecovPlugin, 'lift');
  });

  teardown(() => sandbox.restore());

  test('that `nyc` is replaced by `c8` if nyc config exists', async () => {
    const mergedResults = any.simpleObject();
    c8Scaffolder.default.withArgs({projectRoot}).resolves(c8Results);
    nycTester.default.withArgs({projectRoot}).resolves(true);
    codecovPlugin.lift.withArgs({projectRoot, packageManager}).resolves(codecovResults);
    deepmerge.all
      .withArgs([
        c8Results,
        codecovResults,
        {
          scripts: {'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base'},
          nextSteps: [{
            summary: 'Remove use of `@istanbuljs/nyc-config-babel` from your babel config, if present,'
              + ' after the migration away from `nyc`'
          }]
        }
      ])
      .returns(mergedResults);

    assert.equal(await lift({projectRoot, packageManager}), mergedResults);

    assert.calledWith(nycRemover.default, {projectRoot, packageManager});
  });

  test('that `nyc` is not replaced by `c8` if nyc config does not exist', async () => {
    c8Scaffolder.default.withArgs({projectRoot}).resolves(c8Results);
    nycTester.default.withArgs({projectRoot}).resolves(false);
    codecovPlugin.lift.withArgs({projectRoot, packageManager}).resolves(codecovResults);

    assert.deepEqual(await lift({projectRoot, packageManager}), codecovResults);

    assert.notCalled(c8Scaffolder.default);
  });
});
