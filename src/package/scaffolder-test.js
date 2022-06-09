import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as configFile from './config-file';
import * as buildPackageDetails from './details';
import {scaffold} from './index';

suite('package scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(configFile, 'write');
    sandbox.stub(buildPackageDetails, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the package file is created and dependencies are installed', async () => {
    const packageName = any.string();
    const homepage = any.url();
    const packageDetails = {...any.simpleObject(), homepage};
    const projectRoot = any.string();
    const projectType = any.word();
    const dialect = any.word();
    const license = any.string();
    const vcs = any.simpleObject();
    const author = any.simpleObject();
    const description = any.sentence();
    const scripts = any.simpleObject();
    const packageProperties = any.simpleObject();
    const pathWithinParent = any.string();
    buildPackageDetails.default
      .withArgs({
        packageName,
        projectType,
        dialect,
        license,
        vcs,
        author,
        description,
        scripts,
        packageProperties,
        pathWithinParent
      })
      .resolves(packageDetails);

    assert.deepEqual(
      await scaffold({
        projectRoot,
        projectType,
        dialect,
        scripts,
        packageName,
        license,
        vcs,
        author,
        description,
        packageProperties,
        pathWithinParent
      }),
      {homepage}
    );

    assert.calledWith(configFile.write, {projectRoot, config: packageDetails});
  });
});
