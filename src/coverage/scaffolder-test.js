import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import * as codecovScaffolder from './codecov';
import * as nycScaffolder from './nyc';
import scaffold from './scaffolder';

suite('coverage scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(nycScaffolder, 'default');
    sandbox.stub(codecovScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that coverage measurement and reporting are scaffolded', async () => {
    const vcs = any.simpleObject();
    const visibility = any.word();
    const projectRoot = any.string();
    const nycResults = any.simpleObject();
    const codecovResults = any.simpleObject();
    nycScaffolder.default.withArgs({projectRoot}).resolves(nycResults);
    codecovScaffolder.scaffold.withArgs({vcs, visibility}).returns(codecovResults);

    const results = await scaffold({vcs, visibility, projectRoot});

    assert.deepEqual(results, {...nycResults, ...codecovResults});
  });
});
