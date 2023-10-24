import {promises as fsPromises} from 'fs';

import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';

import * as nodeVersionTasks from './tasks.js';
import scaffoldNodeVersion from './index.js';

suite('node-version scaffolder', () => {
  const projectRoot = any.string();
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(nodeVersionTasks, 'determineLatestVersionOf');
    sandbox.stub(nodeVersionTasks, 'install');
    sandbox.stub(fsPromises, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that nvm is configured with the desired version', async () => {
    const nodeVersionCategory = any.word();
    const version = any.word();
    nodeVersionTasks.determineLatestVersionOf.withArgs(nodeVersionCategory).resolves(version);

    assert.equal(await scaffoldNodeVersion({projectRoot, nodeVersionCategory}), version);
    assert.calledWith(nodeVersionTasks.install, nodeVersionCategory);
    assert.calledWith(fsPromises.writeFile, `${projectRoot}/.nvmrc`, version);
  });

  test('that `undefined` is returned when a category is not defined', async () => {
    assert.isUndefined(await scaffoldNodeVersion({projectRoot}));
  });
});
