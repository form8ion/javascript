import deepmerge from 'deepmerge';
import scaffoldFrameworkChoice from '../choice-scaffolder';
import validate from '../options-validator';
import scaffoldNyc from '../coverage/nyc';
import {unitTestFrameworksSchema} from './options-schemas';
import chooseFramework from './prompt';

export default async function ({projectRoot, frameworks, decisions, visibility, vcs}) {
  const validatedFrameworks = validate(unitTestFrameworksSchema, frameworks);
  const [framework, nyc] = await Promise.all([
    chooseFramework({frameworks: validatedFrameworks, decisions})
      .then(chosenFramework => scaffoldFrameworkChoice(validatedFrameworks, chosenFramework, {projectRoot})),
    scaffoldNyc({projectRoot, vcs, visibility})
  ]);

  return deepmerge.all([
    {
      devDependencies: 'Public' === visibility ? ['codecov'] : [],
      scripts: {
        'test:unit': 'cross-env NODE_ENV=test nyc run-s test:unit:base',
        ...'Public' === visibility && {'coverage:report': 'nyc report --reporter=text-lcov > coverage.lcov && codecov'}
      }
    },
    framework,
    nyc
  ]);
}
