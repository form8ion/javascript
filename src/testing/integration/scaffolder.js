import {scaffoldChoice as scaffoldFrameworkChoice} from '@form8ion/javascript-core';

import chooseFramework from './prompt.js';

export default async function scaffoldIntegrationTesting({
  projectRoot,
  frameworks: integrationTestFrameworks,
  dialect
}, {prompt}) {
  const chosenFramework = await chooseFramework({frameworks: integrationTestFrameworks, prompt});

  return scaffoldFrameworkChoice(integrationTestFrameworks, chosenFramework, {projectRoot, dialect});
}
