import {dialects} from '@form8ion/javascript-core';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as babel from './babel/scaffolder.js';
import * as typescript from './typescript/scaffolder.js';
import scaffoldDialect from './scaffolder.js';

suite('scaffold dialect', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(babel, 'default');
    sandbox.stub(typescript, 'default');
  });

  teardown(() => sandbox.restore());

  test('that babel is scaffolded when chosen', async () => {
    const babelPreset = any.word();
    const babelResults = any.simpleObject();
    babel.default.withArgs({preset: babelPreset, projectRoot}).resolves(babelResults);

    assert.equal(
      await scaffoldDialect({dialect: dialects.BABEL, configs: {babelPreset}, projectRoot}),
      babelResults
    );
  });

  test('that typescript is scaffolded when chosen', async () => {
    const typescriptConfigs = any.simpleObject();
    const typescriptResults = any.simpleObject();
    const testFilenamePattern = any.string();
    const projectType = any.word();
    typescript.default
      .withArgs({config: typescriptConfigs, projectType, projectRoot, testFilenamePattern})
      .resolves(typescriptResults);

    assert.equal(
      await scaffoldDialect({
        dialect: dialects.TYPESCRIPT,
        projectType,
        configs: {typescript: typescriptConfigs},
        projectRoot,
        testFilenamePattern
      }),
      typescriptResults
    );
  });

  test('that neither babel nor typescript are scaffolded when not chosen', async () => {
    assert.deepEqual(await scaffoldDialect({dialect: any.word()}), {});
    assert.notCalled(babel.default);
    assert.notCalled(typescript.default);
  });
});
