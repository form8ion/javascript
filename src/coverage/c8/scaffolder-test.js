import {promises as fsPromises} from 'fs';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldC8 from './scaffolder';

suite('c8 scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const vcsOwner = any.word();
  const vcsName = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fsPromises, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that c8 is scaffolded', async () => {
    assert.deepEqual(
      await scaffoldC8({projectRoot, vcs: {owner: vcsOwner, name: vcsName, host: 'github'}, visibility: 'Public'}),
      {
        devDependencies: ['cross-env', 'c8'],
        vcsIgnore: {files: [], directories: ['/coverage/']},
        eslint: {ignore: {directories: ['/coverage/']}}
      }
    );
    assert.calledWith(
      fsPromises.writeFile,
      `${projectRoot}/.c8rc.json`,
      JSON.stringify({
        reporter: ['lcov', 'text-summary', 'html'],
        exclude: ['src/**/*-test.js', 'test/', 'thirdparty-wrappers/', 'vendor/']
      }, null, 2)
    );
  });
});
