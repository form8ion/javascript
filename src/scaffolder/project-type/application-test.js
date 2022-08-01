import * as jsCore from '@form8ion/javascript-core';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import scaffoldApplication from './application';

suite('application project-type', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jsCore, 'mergeIntoExistingPackageJson');
  });

  teardown(() => sandbox.restore());

  test('that details specific to an application project-type are scaffolded', async () => {
    const buildDirectory = 'public';

    assert.deepEqual(
      await scaffoldApplication({projectRoot}),
      {
        scripts: {
          clean: `rimraf ./${buildDirectory}`,
          start: `node ./${buildDirectory}/index.js`,
          prebuild: 'run-s clean'
        },
        dependencies: [],
        devDependencies: ['rimraf'],
        vcsIgnore: {
          files: ['.env'],
          directories: [`/${buildDirectory}/`]
        },
        buildDirectory,
        nextSteps: []
      }
    );
    assert.calledWith(jsCore.mergeIntoExistingPackageJson, {projectRoot, config: {private: true}});
  });
});
