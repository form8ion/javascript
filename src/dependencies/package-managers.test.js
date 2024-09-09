import {DEV_DEPENDENCY_TYPE, packageManagers, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

import {describe, expect, it} from 'vitest';
import {details, getDependencyTypeFlag, getExactFlag, getInstallationCommandFor} from './package-managers.js';

describe('package managers', () => {
  describe('details', () => {
    it('should map the names to the cli names', () => {
      expect(packageManagers.NPM).toEqual('npm');
      expect(packageManagers.YARN).toEqual('yarn');
    });

    it('should define installation details for npm correctly', () => {
      const {installationCommand, installationFlags} = details[packageManagers.NPM];

      expect(installationCommand).toEqual('install');
      expect(installationFlags[DEV_DEPENDENCY_TYPE]).toEqual('save-dev');
      expect(installationFlags[PROD_DEPENDENCY_TYPE]).toEqual('save-prod');
      expect(installationFlags.exact).toEqual('save-exact');
    });

    it('should define installation details correctly for yarn', () => {
      const {installationCommand, installationFlags} = details[packageManagers.YARN];

      expect(installationCommand).toEqual('add');
      expect(installationFlags[DEV_DEPENDENCY_TYPE]).toEqual('dev');
      expect(installationFlags[PROD_DEPENDENCY_TYPE]).toEqual('prod');
      expect(installationFlags.exact).toEqual('exact');
    });
  });

  describe('resolvers', () => {
    function assertPackageManagerDetails(manager) {
      const {installationCommand, installationFlags} = details[manager];

      expect(getInstallationCommandFor(manager)).toEqual(installationCommand);
      expect(getDependencyTypeFlag(manager, DEV_DEPENDENCY_TYPE)).toEqual(installationFlags[DEV_DEPENDENCY_TYPE]);
      expect(getDependencyTypeFlag(manager, PROD_DEPENDENCY_TYPE)).toEqual(installationFlags[PROD_DEPENDENCY_TYPE]);
      expect(getExactFlag(manager)).toEqual(installationFlags.exact);
    }

    it('should resolve the proper details for npm', () => assertPackageManagerDetails(packageManagers.NPM));

    it('should resolve the proper details for yarn', () => assertPackageManagerDetails(packageManagers.YARN));
  });
});
