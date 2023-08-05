import deepmerge from 'deepmerge';

import {lift as liftProvenance} from './provenance';

export default async function ({projectRoot, packageDetails}) {
  return deepmerge(
    await liftProvenance({packageDetails, projectRoot}),
    {devDependencies: ['publint'], scripts: {'lint:publish': 'publint --strict'}}
  );
}
