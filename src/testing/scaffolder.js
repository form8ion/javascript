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
  const unitResults = unit
    ? await scaffoldUnitTesting({projectRoot, frameworks: unitTestFrameworks, decisions, dialect})
    : {};
  const integrationResults = integration
    ? await scaffoldIntegrationTesting({projectRoot, frameworks: integrationTestFrameworks, decisions, dialect})
    : {};

  return deepmerge.all([
    {dependencies: {javascript: {development: [...(unit || integration) ? ['@travi/any'] : []]}}, eslint: {}},
    unitResults,
    integrationResults
  ]);
}
