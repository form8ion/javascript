import {scaffoldChoice} from '@form8ion/javascript-core';

import chooseProjectTypePlugin from './prompt.js';

export default async function scaffoldProjectTypePlugin({
  projectRoot,
  projectType,
  projectName,
  packageName,
  packageManager,
  scope,
  dialect,
  tests,
  plugins
}, {prompt}) {
  const pluginsForProjectType = plugins[projectType];

  if (!pluginsForProjectType) return {};

  const chosenType = await chooseProjectTypePlugin({types: pluginsForProjectType, projectType}, {prompt});

  return scaffoldChoice(
    pluginsForProjectType,
    chosenType,
    {projectRoot, projectName, packageName, packageManager, scope, tests, dialect}
  );
}
