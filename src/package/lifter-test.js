import {promises as fs} from 'fs';
import * as jsCore from '@form8ion/javascript-core';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as configFile from './config-file';
import liftPackage from './lifter';

suite('package.json lifter', () => {
  let sandbox;
  const projectRoot = any.string();
  const pathToPackageJson = `${projectRoot}/package.json`;
  const packageJsonContents = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jsCore, 'installDependencies');
    sandbox.stub(configFile, 'write');
    sandbox.stub(fs, 'readFile');
  });

  teardown(() => sandbox.restore());

  suite('scripts', () => {
    test('that the scripts are added to the `package.json`', async () => {
      const scripts = any.simpleObject();
      const originalScripts = any.simpleObject();
      fs.readFile
        .withArgs(pathToPackageJson, 'utf8')
        .resolves(JSON.stringify({...packageJsonContents, scripts: originalScripts}));

      await liftPackage({projectRoot, scripts});

      assert.calledWith(
        configFile.write,
        {projectRoot, config: {...packageJsonContents, scripts: {...originalScripts, ...scripts}}}
      );
    });
  });

  suite('keywords', () => {
    test('that tags are added as keywords when none exist previously', async () => {
      const tags = any.listOf(any.word);
      fs.readFile
        .withArgs(pathToPackageJson, 'utf8')
        .resolves(JSON.stringify(packageJsonContents));

      await liftPackage({projectRoot, tags});

      assert.calledWith(
        configFile.write,
        {projectRoot, config: {...packageJsonContents, scripts: {}, keywords: tags}}
      );
    });

    test('that tags are added as keywords when some keywords already exist', async () => {
      const tags = any.listOf(any.word);
      const existingKeywords = any.listOf(any.word);
      fs.readFile
        .withArgs(pathToPackageJson, 'utf8')
        .resolves(JSON.stringify({...packageJsonContents, scripts: {}, keywords: existingKeywords}));

      await liftPackage({projectRoot, tags});

      assert.calledWith(
        configFile.write,
        {projectRoot, config: {...packageJsonContents, scripts: {}, keywords: [...existingKeywords, ...tags]}}
      );
    });

    test('that keywords are not modified when some keywords already exist but none are provided', async () => {
      const existingKeywords = any.listOf(any.word);
      fs.readFile
        .withArgs(pathToPackageJson, 'utf8')
        .resolves(JSON.stringify({...packageJsonContents, scripts: {}, keywords: existingKeywords}));

      await liftPackage({projectRoot, scripts: {}});

      assert.calledWith(
        configFile.write,
        {projectRoot, config: {...packageJsonContents, scripts: {}, keywords: existingKeywords}}
      );
    });
  });

  suite('dependencies', () => {
    const dependencies = any.listOf(any.word);
    const devDependencies = any.listOf(any.word);
    const packageManager = any.word();

    test('that dependencies and devDependencies are installed when provided', async () => {
      await liftPackage({projectRoot, dependencies, devDependencies, packageManager});

      assert.calledWith(
        jsCore.installDependencies,
        dependencies,
        jsCore.PROD_DEPENDENCY_TYPE,
        projectRoot,
        packageManager
      );
      assert.calledWith(
        jsCore.installDependencies,
        devDependencies,
        jsCore.DEV_DEPENDENCY_TYPE,
        projectRoot,
        packageManager
      );
    });

    test('that eslint devDependencies are added when provided', async () => {
      await liftPackage({projectRoot, dependencies, devDependencies, packageManager});

      assert.calledWith(
        jsCore.installDependencies,
        dependencies,
        jsCore.PROD_DEPENDENCY_TYPE,
        projectRoot,
        packageManager
      );
      assert.calledWith(
        jsCore.installDependencies,
        devDependencies,
        jsCore.DEV_DEPENDENCY_TYPE,
        projectRoot,
        packageManager
      );
    });

    test('that only dependencies are installed when no dev-dependencies are provided', async () => {
      await liftPackage({projectRoot, dependencies, packageManager});

      assert.calledWith(
        jsCore.installDependencies,
        dependencies,
        jsCore.PROD_DEPENDENCY_TYPE,
        projectRoot,
        packageManager
      );
      assert.calledWith(jsCore.installDependencies, [], jsCore.DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
    });

    test('that only dev-dependencies are installed when no dependencies are provided', async () => {
      await liftPackage({projectRoot, devDependencies, packageManager});

      assert.calledWith(
        jsCore.installDependencies,
        devDependencies,
        jsCore.DEV_DEPENDENCY_TYPE,
        projectRoot,
        packageManager
      );
      assert.calledWith(jsCore.installDependencies, [], jsCore.PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    });

    test('that a failure to install dependencies does not result in a failure to lift the package file', async () => {
      jsCore.installDependencies
        .withArgs(dependencies, jsCore.PROD_DEPENDENCY_TYPE, projectRoot, packageManager)
        .throws(new Error());

      await liftPackage({dependencies, projectRoot, packageManager});
    });

    test('that a failure to install dev-dependencies doesnt result in a failure to lift the package file', async () => {
      jsCore.installDependencies
        .withArgs(devDependencies, jsCore.DEV_DEPENDENCY_TYPE, projectRoot, packageManager)
        .throws(new Error());

      await liftPackage({devDependencies, projectRoot, packageManager});
    });
  });

  test('that no updates are applied if no new scripts or tags are provided', async () => {
    await liftPackage({});

    assert.notCalled(fs.readFile);
    assert.notCalled(configFile.write);
  });
});
