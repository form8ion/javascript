import deepmerge from 'deepmerge';

import {scaffold as scaffoldUnitTesting} from './unit/index.js';
import {scaffold as scaffoldIntegrationTesting} from './integration/index.js';

export default async function scaffoldTesting({
  projectRoot,
  tests: {unit, integration},
  unitTestFrameworks,
  integrationTestFrameworks,
  dialect
}, {prompt}) {
  const unitResults = unit
    ? await scaffoldUnitTesting({projectRoot, frameworks: unitTestFrameworks, dialect}, {prompt})
    : {};
  const integrationResults = integration
    ? await scaffoldIntegrationTesting({projectRoot, frameworks: integrationTestFrameworks, dialect}, {prompt})
    : {};

  return deepmerge.all([
    {dependencies: {javascript: {development: [...(unit || integration) ? ['@travi/any'] : []]}}, eslint: {}},
    unitResults,
    integrationResults
  ]);
}
