import deepmerge from 'deepmerge';

import {scaffold as scaffoldUnitTesting} from './unit/index.js';
import {scaffold as scaffoldIntegrationTesting} from './integration/index.js';

export default async function scaffoldTesting({
  projectRoot,
  tests: {unit, integration},
  unitTestFrameworks,
  integrationTestFrameworks,
  decisions,
  dialect
}) {
  const [unitResults, integrationResults] = await Promise.all([
    unit ? scaffoldUnitTesting({projectRoot, frameworks: unitTestFrameworks, decisions, dialect}) : {},
    integration
      ? scaffoldIntegrationTesting({projectRoot, frameworks: integrationTestFrameworks, decisions, dialect})
      : {}
  ]);

  return deepmerge.all([
    {dependencies: {javascript: {development: [...(unit || integration) ? ['@travi/any'] : []]}}, eslint: {}},
    unitResults,
    integrationResults
  ]);
}
