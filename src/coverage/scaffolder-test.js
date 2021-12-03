import * as codecovScaffolder from '@form8ion/codecov';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import * as c8Scaffolder from './c8';
import scaffold from './scaffolder';

suite('coverage scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(c8Scaffolder, 'default');
    sandbox.stub(codecovScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that coverage measurement and reporting are scaffolded', async () => {
    const vcs = any.simpleObject();
    const visibility = any.word();
    const projectRoot = any.string();
    const c8Results = any.simpleObject();
    const codecovResults = any.simpleObject();
    c8Scaffolder.default.withArgs({projectRoot}).resolves(c8Results);
    codecovScaffolder.scaffold.withArgs({vcs, visibility}).resolves(codecovResults);

    const results = await scaffold({vcs, visibility, projectRoot});

    assert.deepEqual(results, {...c8Results, ...codecovResults});
  });
});
