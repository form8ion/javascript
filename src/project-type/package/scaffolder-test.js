import jsCore from '@form8ion/javascript-core';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as documentationScaffolder from './documentation';
import * as defineBadges from './badges';
import * as buildDetails from './build-details';
import scaffoldPackage from './scaffolder';

suite('package project-type', () => {
  let sandbox;
  const projectRoot = any.string();
  const packageBundlers = any.simpleObject();
  const projectName = any.word();
  const packageName = any.word();
  const packageManager = any.word();
  const visibility = 'Private';
  const scope = any.word();
  const provideExample = any.boolean();
  const badges = {consumer: any.simpleObject(), contribution: any.simpleObject(), status: any.simpleObject()};
  const commonNextSteps = [
    {summary: 'Add the appropriate `save` flag to the installation instructions in the README'},
    {summary: 'Publish pre-release versions to npm until package is stable enough to publish v1.0.0'}
  ];
  const documentation = any.simpleObject();
  const decisions = any.simpleObject();
  const buildDetailsResults = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(buildDetails, 'default');
    sandbox.stub(defineBadges, 'default');
    sandbox.stub(documentationScaffolder, 'default');
    sandbox.stub(jsCore, 'mergeIntoExistingPackageJson');

    documentationScaffolder.default
      .withArgs({scope, packageName, visibility, packageManager, provideExample})
      .returns(documentation);
  });

  teardown(() => sandbox.restore());

  test('that details specific to a modern-js package are scaffolded', async () => {
    const dialect = jsCore.dialects.BABEL;
    defineBadges.default.withArgs(packageName, visibility).returns(badges);
    buildDetails.default
      .withArgs({
        projectRoot,
        projectName,
        packageBundlers,
        visibility,
        packageName,
        dialect,
        provideExample,
        decisions
      })
      .resolves(buildDetailsResults);

    assert.deepEqual(
      await scaffoldPackage({
        projectRoot,
        projectName,
        packageName,
        packageManager,
        visibility,
        scope,
        packageBundlers,
        decisions,
        dialect,
        provideExample
      }),
      {
        ...buildDetailsResults,
        scripts: {'lint:publish': 'publint'},
        badges,
        documentation,
        nextSteps: commonNextSteps,
        devDependencies: ['publint']
      }
    );
    assert.calledWith(
      jsCore.mergeIntoExistingPackageJson,
      {
        projectRoot,
        config: {
          sideEffects: false,
          main: './lib/index.js',
          module: './lib/index.mjs',
          exports: {
            require: './lib/index.js',
            import: './lib/index.mjs'
          },
          files: ['example.js', 'lib/'],
          publishConfig: {access: 'restricted', provenance: true}
        }
      }
    );
  });

  test('that details specific to an esm-only package are scaffolded', async () => {
    const dialect = jsCore.dialects.ESM;
    defineBadges.default.withArgs(packageName, visibility).returns(badges);
    buildDetails.default
      .withArgs({
        projectRoot,
        projectName,
        packageBundlers,
        visibility,
        packageName,
        dialect,
        provideExample,
        decisions
      })
      .resolves(buildDetailsResults);

    assert.deepEqual(
      await scaffoldPackage({
        projectRoot,
        projectName,
        packageName,
        visibility,
        dialect,
        scope,
        packageManager,
        packageBundlers,
        decisions,
        provideExample
      }),
      {
        ...buildDetailsResults,
        scripts: {'lint:publish': 'publint'},
        badges,
        documentation,
        nextSteps: commonNextSteps,
        devDependencies: ['publint']
      }
    );
    assert.calledWith(
      jsCore.mergeIntoExistingPackageJson,
      {
        projectRoot,
        config: {
          main: './lib/index.mjs',
          exports: './lib/index.mjs',
          files: ['example.js', 'lib/'],
          sideEffects: false,
          publishConfig: {access: 'restricted', provenance: true}
        }
      }
    );
  });

  test('that details specific to a typescript package are scaffolded', async () => {
    const dialect = jsCore.dialects.TYPESCRIPT;
    defineBadges.default.withArgs(packageName, visibility).returns(badges);
    buildDetails.default
      .withArgs({
        projectRoot,
        projectName,
        packageBundlers,
        visibility,
        packageName,
        dialect,
        provideExample,
        decisions
      })
      .resolves(buildDetailsResults);

    assert.deepEqual(
      await scaffoldPackage({
        projectRoot,
        projectName,
        packageName,
        packageManager,
        visibility,
        scope,
        packageBundlers,
        decisions,
        dialect,
        provideExample
      }),
      {
        ...buildDetailsResults,
        scripts: {'lint:publish': 'publint'},
        badges,
        documentation,
        nextSteps: commonNextSteps,
        devDependencies: ['publint']
      }
    );
    assert.calledWith(
      jsCore.mergeIntoExistingPackageJson,
      {
        projectRoot,
        config: {
          sideEffects: false,
          main: './lib/index.js',
          module: './lib/index.mjs',
          types: './lib/index.d.ts',
          exports: {
            types: './lib/index.d.ts',
            require: './lib/index.js',
            import: './lib/index.mjs'
          },
          files: ['example.js', 'lib/'],
          publishConfig: {access: 'restricted', provenance: true}
        }
      }
    );
  });

  test('that build details are not included when the project will not be transpiled', async () => {
    const dialect = jsCore.dialects.COMMON_JS;
    defineBadges.default.withArgs(packageName, visibility).returns(badges);
    buildDetails.default
      .withArgs({
        projectRoot,
        projectName,
        packageBundlers,
        visibility,
        packageName,
        dialect,
        provideExample,
        decisions
      })
      .resolves(buildDetailsResults);

    assert.deepEqual(
      await scaffoldPackage({
        projectRoot,
        packageName,
        projectName,
        packageManager,
        visibility,
        scope,
        decisions,
        packageBundlers,
        dialect,
        provideExample
      }),
      {
        ...buildDetailsResults,
        scripts: {'lint:publish': 'publint'},
        badges,
        documentation,
        nextSteps: commonNextSteps,
        devDependencies: ['publint']
      }
    );
    assert.calledWith(
      jsCore.mergeIntoExistingPackageJson,
      {
        projectRoot,
        config: {
          files: ['example.js', 'index.js'],
          publishConfig: {access: 'restricted', provenance: true},
          sideEffects: false
        }
      }
    );
  });

  test('that the registry to publish to is defined when provided', async () => {
    const publishRegistry = any.url();
    const dialect = jsCore.dialects.BABEL;
    buildDetails.default
      .withArgs({
        projectRoot,
        projectName,
        packageBundlers,
        visibility,
        packageName,
        dialect,
        provideExample,
        decisions
      })
      .resolves(buildDetailsResults);

    await scaffoldPackage({
      projectRoot,
      packageName,
      projectName,
      packageManager,
      visibility,
      scope,
      decisions,
      publishRegistry,
      dialect,
      provideExample,
      packageBundlers
    });

    assert.calledWith(
      jsCore.mergeIntoExistingPackageJson,
      {
        projectRoot,
        config: {
          sideEffects: false,
          main: './lib/index.js',
          module: './lib/index.mjs',
          exports: {
            require: './lib/index.js',
            import: './lib/index.mjs'
          },
          files: ['example.js', 'lib/'],
          publishConfig: {
            access: 'restricted',
            registry: publishRegistry,
            provenance: true
          }
        }
      }
    );
  });
});
