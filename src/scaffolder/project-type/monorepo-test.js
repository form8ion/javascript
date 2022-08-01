import * as jsCore from '@form8ion/javascript-core';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldMonorepo from './monorepo';

suite('monorepo project-type', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jsCore, 'mergeIntoExistingPackageJson');
  });

  teardown(() => sandbox.restore());

  test('that details specific to a monorepo project-type are scaffolded', async () => {
    assert.deepEqual(
      await scaffoldMonorepo({projectRoot}),
      {
        nextSteps: [{
          summary: 'Add packages to your new monorepo',
          description: 'Leverage [@form8ion/add-package-to-monorepo](https://npm.im/@form8ion/add-package-to-monorepo)'
            + ' to scaffold new packages into your new monorepo'
        }]
      }
    );
    assert.calledWith(jsCore.mergeIntoExistingPackageJson, {projectRoot, config: {private: true}});
  });
});
