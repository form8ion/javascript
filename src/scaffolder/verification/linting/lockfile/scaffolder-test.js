import {promises as fs} from 'fs';
import {packageManagers} from '@form8ion/javascript-core';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as allowedHostsBuilder from './allowed-hosts-builder';
import scaffoldLockfileLint from './scaffolder';

const lockfileLintSupportedPackageManagers = [packageManagers.NPM, packageManagers.YARN];

suite('lockfile linting', () => {
  let sandbox;
  const projectRoot = any.string();
  const registries = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'writeFile');
    sandbox.stub(allowedHostsBuilder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that it is configured properly for npm', async () => {
    const allowedHosts = any.listOf(any.url);
    allowedHostsBuilder.default.withArgs({packageManager: packageManagers.NPM, registries}).returns(allowedHosts);

    const {devDependencies, scripts} = await scaffoldLockfileLint({
      projectRoot,
      packageManager: packageManagers.NPM,
      registries
    });

    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/.lockfile-lintrc.json`,
      JSON.stringify({
        path: 'package-lock.json',
        type: packageManagers.NPM,
        'validate-https': true,
        'allowed-hosts': allowedHosts
      })
    );
    assert.deepEqual(devDependencies, ['lockfile-lint']);
    assert.equal(scripts['lint:lockfile'], 'lockfile-lint');
  });

  test('that it is configured properly for yarn', async () => {
    const allowedHosts = any.listOf(any.url);
    allowedHostsBuilder.default.withArgs({packageManager: packageManagers.YARN, registries}).returns(allowedHosts);

    const {devDependencies, scripts} = await scaffoldLockfileLint({
      projectRoot,
      packageManager: packageManagers.YARN,
      registries
    });

    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/.lockfile-lintrc.json`,
      JSON.stringify({
        path: 'yarn.lock',
        type: packageManagers.YARN,
        'validate-https': true,
        'allowed-hosts': allowedHosts
      })
    );
    assert.deepEqual(devDependencies, ['lockfile-lint']);
    assert.equal(scripts['lint:lockfile'], 'lockfile-lint');
  });

  test('that an error is thrown for unsupported package managers', async () => {
    const packageManager = any.word();

    try {
      await scaffoldLockfileLint({projectRoot, packageManager});

      throw new Error('An error should have been thrown for the unsupported package manager');
    } catch (e) {
      assert.equal(
        e.message,
        `The ${packageManager} package manager is currently not supported by lockfile-lint. `
        + `Only ${lockfileLintSupportedPackageManagers.join(' and ')} are currently supported.`
      );
    }
  });
});