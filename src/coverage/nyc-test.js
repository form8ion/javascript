import {promises as fsPromises} from 'fs';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldNyc from './nyc';

suite('nyc scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const vcsOwner = any.word();
  const vcsName = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fsPromises, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that nyc is scaffolded', async () => {
    assert.deepEqual(
      await scaffoldNyc({projectRoot, vcs: {owner: vcsOwner, name: vcsName, host: 'github'}, visibility: 'Public'}),
      {
        devDependencies: ['cross-env', 'nyc', '@istanbuljs/nyc-config-babel'],
        vcsIgnore: {files: [], directories: ['/coverage/', '/.nyc_output/']},
        eslint: {ignore: {directories: ['/coverage/']}}
      }
    );
    assert.calledWith(
      fsPromises.writeFile,
      `${projectRoot}/.nycrc`,
      JSON.stringify({
        extends: '@istanbuljs/nyc-config-babel',
        reporter: ['lcov', 'text-summary', 'html'],
        exclude: ['src/**/*-test.js', 'test/', 'thirdparty-wrappers/', 'vendor/']
      })
    );
  });
});
