import deepmerge from 'deepmerge';

import {scaffold as scaffoldC8} from './c8';
import {test as nycIsConfigured, remove as removeNyc} from './nyc';

export async function lift({projectRoot, packageManager}) {
  if (await nycIsConfigured({projectRoot})) {
    const [c8Results] = await Promise.all([
      scaffoldC8({projectRoot}),
      removeNyc({projectRoot, packageManager})
    ]);

    return deepmerge.all([
      c8Results,
      {
        scripts: {'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base'},
        nextSteps: [{
          summary: 'Remove use of `@istanbuljs/nyc-config-babel` from your babel config, if present,'
            + ' after the migration away from `nyc`'
        }]
      }
    ]);
  }

  return {};
}
