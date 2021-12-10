import deepmerge from 'deepmerge';
import scaffoldUnitTesting from '../../../testing/unit';

export default async function ({
  projectRoot,
  visibility,
  tests: {unit, integration},
  vcs,
  unitTestFrameworks,
  decisions,
  dialect
}) {
  const unitResults = unit
    ? await scaffoldUnitTesting({projectRoot, visibility, vcs, frameworks: unitTestFrameworks, decisions, dialect})
    : {};

  return deepmerge(
    {devDependencies: [...(unit || integration) ? ['@travi/any'] : []], eslint: [], eslintConfigs: []},
    unitResults
  );
}
