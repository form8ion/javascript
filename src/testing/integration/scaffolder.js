import {scaffoldChoice as scaffoldFrameworkChoice} from '@form8ion/javascript-core';

import chooseFramework from './prompt.js';

export default async function scaffoldIntegrationTesting({
  projectRoot,
  frameworks: integrationTestFrameworks,
  decisions,
  dialect
}) {
  const chosenFramework = await chooseFramework({frameworks: integrationTestFrameworks, decisions});

  return scaffoldFrameworkChoice(integrationTestFrameworks, chosenFramework, {projectRoot, dialect});
}
