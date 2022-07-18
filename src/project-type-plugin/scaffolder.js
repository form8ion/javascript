import {scaffoldChoice} from '@form8ion/javascript-core';

import chooseProjectTypePlugin from './prompt';

export default async function ({
  projectRoot,
  projectType,
  projectName,
  packageName,
  packageManager,
  scope,
  dialect,
  tests,
  decisions,
  plugins
}) {
  const pluginsForProjectType = plugins[projectType];

  if (!pluginsForProjectType) return {};

  const chosenType = await chooseProjectTypePlugin({types: pluginsForProjectType, decisions, projectType});

  return scaffoldChoice(
    pluginsForProjectType,
    chosenType,
    {projectRoot, projectName, packageName, packageManager, scope, tests, dialect}
  );
}
