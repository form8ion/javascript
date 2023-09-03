import deepmerge from 'deepmerge';

import defineBadges from './badges';
import {lift as liftProvenance} from './provenance';

export default async function ({projectRoot, packageDetails}) {
  const {name: packageName, publishConfig: {access: pacakgeAccessLevel}} = packageDetails;

  return deepmerge(
    await liftProvenance({packageDetails, projectRoot}),
    {
      devDependencies: ['publint'],
      scripts: {'lint:publish': 'publint --strict'},
      badges: defineBadges(packageName, pacakgeAccessLevel)
    }
  );
}
