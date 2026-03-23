import deepmerge from 'deepmerge';

import {scaffold as scaffoldUnitTesting} from './unit/index.js';

export default async function scaffoldTesting({
  projectRoot,
  tests: {unit, integration},
  unitTestFrameworks,
  decisions,
  dialect
}) {
  const unitResults = unit
    ? await scaffoldUnitTesting({projectRoot, frameworks: unitTestFrameworks, decisions, dialect})
    : {};

  return deepmerge(
    {dependencies: {javascript: {development: [...(unit || integration) ? ['@travi/any'] : []]}}, eslint: {}},
    unitResults
  );
}
