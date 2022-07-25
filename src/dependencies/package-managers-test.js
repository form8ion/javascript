import {DEV_DEPENDENCY_TYPE, PROD_DEPENDENCY_TYPE, packageManagers} from '@form8ion/javascript-core';

import {assert} from 'chai';

import {details, getDependencyTypeFlag, getExactFlag, getInstallationCommandFor} from './package-managers';

suite('package managers', () => {
  suite('details', () => {
    test('that the names match the cli names', () => {
      assert.equal(packageManagers.NPM, 'npm');
      assert.equal(packageManagers.YARN, 'yarn');
    });

    test('that the installation details are correct for npm', () => {
      const {installationCommand, installationFlags} = details[packageManagers.NPM];

      assert.equal(installationCommand, 'install');
      assert.equal(installationFlags[DEV_DEPENDENCY_TYPE], 'save-dev');
      assert.equal(installationFlags[PROD_DEPENDENCY_TYPE], 'save-prod');
      assert.equal(installationFlags.exact, 'save-exact');
    });

    test('that the installation details are correct for yarn', () => {
      const {installationCommand, installationFlags} = details[packageManagers.YARN];

      assert.equal(installationCommand, 'add');
      assert.equal(installationFlags[DEV_DEPENDENCY_TYPE], 'dev');
      assert.equal(installationFlags[PROD_DEPENDENCY_TYPE], 'prod');
      assert.equal(installationFlags.exact, 'exact');
    });
  });

  suite('resolvers', () => {
    function assertPackageManagerDetails(manager) {
      const {installationCommand, installationFlags} = details[manager];

      assert.equal(getInstallationCommandFor(manager), installationCommand);
      assert.equal(getDependencyTypeFlag(manager, DEV_DEPENDENCY_TYPE), installationFlags[DEV_DEPENDENCY_TYPE]);
      assert.equal(getDependencyTypeFlag(manager, PROD_DEPENDENCY_TYPE), installationFlags[PROD_DEPENDENCY_TYPE]);
      assert.equal(getExactFlag(manager), installationFlags.exact);
    }

    test('that the proper details are resolved for `npm`', () => assertPackageManagerDetails(packageManagers.NPM));

    test('that the proper details are resolved for `yarn`', () => assertPackageManagerDetails(packageManagers.YARN));
  });
});
