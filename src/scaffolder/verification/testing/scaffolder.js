import deepmerge from 'deepmerge';

import scaffoldUnitTesting from '../../../testing/unit.js';

export default async function ({
  projectRoot,
  visibility,
  tests: {unit, integration},
  vcs,
  unitTestFrameworks,
  decisions,
  dialect,
  pathWithinParent
}) {
  const unitResults = unit
    ? await scaffoldUnitTesting({
      projectRoot,
      visibility,
      vcs,
      frameworks: unitTestFrameworks,
      decisions,
      dialect,
      pathWithinParent
    })
    : {};

  return deepmerge({devDependencies: [...(unit || integration) ? ['@travi/any'] : []], eslint: {}}, unitResults);
}
