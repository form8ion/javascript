import deepmerge from 'deepmerge';
import {scaffoldChoice as scaffoldFrameworkChoice, validateOptions} from '@form8ion/javascript-core';
import scaffoldCoverage from '../coverage/scaffolder';
import {unitTestFrameworksSchema} from './options-schemas';
import chooseFramework from './prompt';

export default async function ({projectRoot, frameworks, decisions, visibility, vcs}) {
  const validatedFrameworks = validateOptions(unitTestFrameworksSchema, frameworks);
  const [framework, coverage] = await Promise.all([
    chooseFramework({frameworks: validatedFrameworks, decisions})
      .then(chosenFramework => scaffoldFrameworkChoice(validatedFrameworks, chosenFramework, {projectRoot})),
    scaffoldCoverage({projectRoot, vcs, visibility})
  ]);

  return deepmerge.all([
    {scripts: {'test:unit': 'cross-env NODE_ENV=test nyc run-s test:unit:base'}},
    framework,
    coverage
  ]);
}
