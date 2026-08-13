import {projectTypes} from '@form8ion/javascript-core';

import {scaffold as scaffoldPackageType} from './package/index.js';
import {scaffold as scaffoldApplicationType} from './application/index.js';
import {scaffold as scaffoldMonorepoType} from './monorepo/index.js';
import {scaffold as scaffoldCliType} from './cli/index.js';

export default async function scaffoldProjectType({
  projectType,
  projectRoot,
  projectName,
  packageName,
  packageManager,
  visibility,
  packageBundlers,
  scope,
  dialect,
  provideExample,
  publishRegistry
}, dependencies) {
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
        dialect,
        provideExample,
        publishRegistry
      }, dependencies);
    case projectTypes.APPLICATION:
      return scaffoldApplicationType({projectRoot}, dependencies);
    case projectTypes.CLI:
      return scaffoldCliType({
        visibility,
        projectRoot,
        dialect,
        publishRegistry,
        packageBundlers
      }, dependencies);
    case projectTypes.MONOREPO:
      return scaffoldMonorepoType({projectRoot}, dependencies);
    case 'Other':
      return {};
    default:
      throw new Error(`The project-type of ${projectType} is invalid`);
  }
}
