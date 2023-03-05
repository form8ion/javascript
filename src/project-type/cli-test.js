import jsCore from '@form8ion/javascript-core';
import * as rollupScaffolder from '@form8ion/rollup';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as defineBadges from './package/badges';
import scaffoldCli from './cli';

suite('cli project-type', () => {
  let sandbox;
  const projectRoot = any.string();
  const packageName = any.word();
  const badges = any.simpleObject();
  const configs = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(rollupScaffolder, 'scaffold');
    sandbox.stub(defineBadges, 'default');
    sandbox.stub(jsCore, 'mergeIntoExistingPackageJson');
  });

  teardown(() => sandbox.restore());

  test('that details specific to a cli project-type are scaffolded', async () => {
    const visibility = 'Private';
    const rollupResults = any.simpleObject();
    const dialect = any.word();
    rollupScaffolder.scaffold
      .withArgs({projectRoot, dialect, projectType: jsCore.projectTypes.CLI})
      .resolves(rollupResults);
    defineBadges.default.withArgs(packageName, visibility).returns(badges);

    assert.deepEqual(
      await scaffoldCli({projectRoot, configs, packageName, visibility, dialect}),
      {
        ...rollupResults,
        scripts: {
          clean: 'rimraf ./bin',
          prebuild: 'run-s clean',
          build: 'npm-run-all --print-label --parallel build:*',
          prepack: 'run-s build'
        },
        dependencies: ['update-notifier'],
        devDependencies: ['rimraf'],
        vcsIgnore: {files: [], directories: ['/bin/']},
        buildDirectory: 'bin',
        badges,
        nextSteps: []
      }
    );
    assert.calledWith(
      jsCore.mergeIntoExistingPackageJson,
      {projectRoot, config: {bin: {}, files: ['bin/'], publishConfig: {access: 'restricted'}}}
    );
  });

  test('that the package is published publically when the visibility is `Public`', async () => {
    await scaffoldCli({projectRoot, configs, packageName, visibility: 'Public'});

    assert.calledWith(
      jsCore.mergeIntoExistingPackageJson,
      {projectRoot, config: {bin: {}, files: ['bin/'], publishConfig: {access: 'public'}}}
    );
  });

  test('that the registry to publish to is defined when provided', async () => {
    const publishRegistry = any.url();

    await scaffoldCli({
      projectRoot,
      configs,
      packageName,
      visibility: 'Public',
      publishRegistry
    });

    assert.calledWith(
      jsCore.mergeIntoExistingPackageJson,
      {projectRoot, config: {bin: {}, files: ['bin/'], publishConfig: {access: 'public', registry: publishRegistry}}}
    );
  });
});
