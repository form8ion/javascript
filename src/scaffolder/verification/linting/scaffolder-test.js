import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as scaffoldBanSensitiveFiles from './ban-sensitive-files';
import * as scaffoldLockfileLint from '../../../lockfile-lint/scaffolder';
import scaffold from './index';

suite('linting scaffolder', () => {
  let sandbox;
  const pathWithinParent = any.string();
  const banSensitiveFilesDevDependencies = any.listOf(any.string);
  const banSensitiveFilesScripts = any.simpleObject();
  const lockfileDevDependencies = any.listOf(any.string);
  const lockfileScripts = any.simpleObject();
  const projectRoot = any.string();
  const packageManager = any.word();
  const vcs = any.simpleObject();
  const registries = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffoldBanSensitiveFiles, 'default');
    sandbox.stub(scaffoldLockfileLint, 'default');

    scaffoldBanSensitiveFiles.default
      .withArgs({pathWithinParent})
      .resolves({devDependencies: banSensitiveFilesDevDependencies, scripts: banSensitiveFilesScripts});
    scaffoldLockfileLint.default
      .withArgs({projectRoot, packageManager, registries})
      .resolves({devDependencies: lockfileDevDependencies, scripts: lockfileScripts});
  });

  teardown(() => sandbox.restore());

  test('that linters are configured when config definitions are provided', async () => {
    const result = await scaffold({projectRoot, vcs, packageManager, pathWithinParent, registries});

    assert.deepEqual(result.devDependencies, [...lockfileDevDependencies, ...banSensitiveFilesDevDependencies]);
    assert.deepEqual(result.scripts, {...lockfileScripts, ...banSensitiveFilesScripts});
  });

  test('that ban-sensitive-files is not scaffolded when the project will not be versioned', async () => {
    const result = await scaffold({projectRoot, vcs: undefined, packageManager, registries});

    assert.deepEqual(result.devDependencies, lockfileDevDependencies);
    assert.deepEqual(result.scripts, lockfileScripts);
  });
});
