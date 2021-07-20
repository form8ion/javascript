import deepmerge from 'deepmerge';
import scaffoldFrameworkChoice from '../choice-scaffolder';
import validate from '../options-validator';
import scaffoldCoverage from '../coverage/scaffolder';
import {unitTestFrameworksSchema} from './options-schemas';
import chooseFramework from './prompt';

export default async function ({projectRoot, frameworks, decisions, visibility, vcs}) {
  const validatedFrameworks = validate(unitTestFrameworksSchema, frameworks);
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
