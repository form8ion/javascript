import {projectTypes} from '@form8ion/javascript-core';
import scaffoldPackageType from './package';
import scaffoldApplicationType from './application';
import scaffoldMonorepoType from './monorepo';
import scaffoldCliType from './cli';

export default async function ({
  projectType,
  projectRoot,
  projectName,
  packageName,
  packageManager,
  visibility,
  applicationTypes,
  packageTypes,
  packageBundlers,
  monorepoTypes,
  scope,
  tests,
  vcs,
  decisions,
  dialect,
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
        packageTypes,
        packageBundlers,
        tests,
        vcs,
        decisions,
        dialect,
        publishRegistry
      });
    case projectTypes.APPLICATION:
      return scaffoldApplicationType({
        projectRoot,
        projectName,
        packageName,
        packageManager,
        applicationTypes,
        tests,
        decisions
      });
    case projectTypes.CLI:
      return scaffoldCliType({packageName, visibility, projectRoot, dialect, publishRegistry});
    case projectTypes.MONOREPO:
      return scaffoldMonorepoType({monorepoTypes, projectRoot, packageManager, decisions});
    case 'Other':
      return {
        eslintConfigs: []
      };
    default:
      throw new Error(`The project-type of ${projectType} is invalid`);
  }
}