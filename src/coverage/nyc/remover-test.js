import {promises as fs} from 'fs';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import removeNyc from './remover';

suite('nyc remover', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'unlink');
    sandbox.stub(fs, 'rmdir');
  });

  teardown(() => sandbox.restore());

  test('that configuration and dependencies are removed', async () => {
    const projectRoot = any.string();

    await removeNyc({projectRoot});

    assert.calledWith(fs.unlink, `${projectRoot}/.nycrc`);
    assert.calledWith(fs.rmdir, `${projectRoot}/.nyc_output`, {recursive: true, force: true});
  });
});
