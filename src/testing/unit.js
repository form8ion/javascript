import deepmerge from 'deepmerge';
import {validateOptions} from '@form8ion/core';
import {scaffoldChoice as scaffoldFrameworkChoice} from '@form8ion/javascript-core';

import {scaffold as scaffoldCoverage} from '../coverage/index.js';
import {unitTestFrameworksSchema} from './options-schemas.js';
import chooseFramework from './prompt.js';

export default async function ({projectRoot, frameworks, decisions, visibility, vcs, pathWithinParent, dialect}) {
  const validatedFrameworks = validateOptions(unitTestFrameworksSchema, frameworks);
  const [framework, coverage] = await Promise.all([
    chooseFramework({frameworks: validatedFrameworks, decisions})
      .then(chosenFramework => scaffoldFrameworkChoice(validatedFrameworks, chosenFramework, {projectRoot, dialect})),
    scaffoldCoverage({projectRoot, vcs, visibility, pathWithinParent})
  ]);

  return deepmerge.all([
    {scripts: {'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base'}},
    framework,
    coverage
  ]);
}
