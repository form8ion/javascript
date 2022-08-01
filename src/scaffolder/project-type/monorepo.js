import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';
import {info} from '@travi/cli-messages';

export default async function ({projectRoot}) {
  info('Scaffolding Monorepo Details');

  await mergeIntoExistingPackageJson({projectRoot, config: {private: true}});

  return {
    nextSteps: [{
      summary: 'Add packages to your new monorepo',
      description: 'Leverage [@form8ion/add-package-to-monorepo](https://npm.im/@form8ion/add-package-to-monorepo)'
        + ' to scaffold new packages into your new monorepo'
    }]
  };
}
