import {projectTypes} from '@form8ion/javascript-core';
import {scaffold as scaffoldPackageType} from './package';
import scaffoldApplicationType from './application';
import scaffoldMonorepoType from './monorepo';
import {scaffold as scaffoldCliType} from './cli';

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
      return scaffoldCliType({packageName, visibility, projectRoot, dialect, publishRegistry});
    case projectTypes.MONOREPO:
      return scaffoldMonorepoType({projectRoot});
    case 'Other':
      return {};
    default:
      throw new Error(`The project-type of ${projectType} is invalid`);
  }
}
