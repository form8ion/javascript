import deepmerge from 'deepmerge';
import {scaffoldChoice as scaffoldFrameworkChoice, validateOptions} from '@form8ion/javascript-core';
import {scaffold as scaffoldCoverage} from '../coverage';
import {unitTestFrameworksSchema} from './options-schemas';
import chooseFramework from './prompt';

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
