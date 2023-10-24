import deepmerge from 'deepmerge';
import {lift as liftCodecov} from '@form8ion/codecov';

import {scaffold as scaffoldC8} from './c8/index.js';
import {test as nycIsConfigured, remove as removeNyc} from './nyc/index.js';

export async function lift({projectRoot, packageManager, vcs}) {
  const codecovResults = await liftCodecov({projectRoot, packageManager, vcs});

  if (await nycIsConfigured({projectRoot})) {
    const [c8Results] = await Promise.all([
      scaffoldC8({projectRoot}),
      removeNyc({projectRoot, packageManager})
    ]);

    return deepmerge.all([
      c8Results,
      codecovResults,
      {
        scripts: {'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base'},
        nextSteps: [{
          summary: 'Remove use of `@istanbuljs/nyc-config-babel` from your babel config, if present,'
            + ' after the migration away from `nyc`'
        }]
      }
    ]);
  }

  return codecovResults;
}
