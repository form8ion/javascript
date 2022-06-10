import {promises as fs} from 'fs';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as dependencyRemover from '../../dependencies/remover';
import removeNyc from './remover';

suite('nyc remover', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'unlink');
    sandbox.stub(fs, 'rm');
    sandbox.stub(dependencyRemover, 'default');
  });

  teardown(() => sandbox.restore());

  test('that configuration and dependencies are removed', async () => {
    const projectRoot = any.string();
    const packageManager = any.word();

    await removeNyc({projectRoot, packageManager});

    assert.calledWith(fs.unlink, `${projectRoot}/.nycrc`);
    assert.calledWith(fs.rm, `${projectRoot}/.nyc_output`, {recursive: true, force: true});
    assert.calledWith(
      dependencyRemover.default,
      {packageManager, dependencies: ['nyc', '@istanbuljs/nyc-config-babel', 'babel-plugin-istanbul']}
    );
  });
});
