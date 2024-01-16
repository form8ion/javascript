import {projectTypes} from '@form8ion/javascript-core';

import {scaffold as scaffoldPackageType} from './package/index.js';
import {scaffold as scaffoldApplicationType} from './application/index.js';
import {scaffold as scaffoldMonorepoType} from './monorepo/index.js';
import {scaffold as scaffoldCliType} from './cli/index.js';

export default async function ({
  projectType,
  projectRoot,
  projectName,
  packageName,
  packageManager,
  visibility,
  packageBundlers,
  scope,
  vcs,
  decisions,
  dialect,
  provideExample,
  publishRegistry
}) {
  switch (projectType) {
    case projectTypes.PACKAGE:
      return scaffoldPackageType({
        projectRoot,
        projectName,
        packageName,
        packageManager,
        visibility,
        scope,
        packageBundlers,
        vcs,
        decisions,
        dialect,
        provideExample,
        publishRegistry
      });
    case projectTypes.APPLICATION:
      return scaffoldApplicationType({projectRoot});
    case projectTypes.CLI:
      return scaffoldCliType({
        packageName,
        visibility,
        projectRoot,
        dialect,
        publishRegistry,
        decisions,
        packageBundlers
      });
    case projectTypes.MONOREPO:
      return scaffoldMonorepoType({projectRoot});
    case 'Other':
      return {};
    default:
      throw new Error(`The project-type of ${projectType} is invalid`);
  }
}
