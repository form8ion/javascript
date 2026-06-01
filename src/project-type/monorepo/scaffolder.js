import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

export default async function scaffoldMonorepo({projectRoot}, {logger}) {
  logger.info('Scaffolding Monorepo Details');

  await mergeIntoExistingPackageJson({projectRoot, config: {private: true}});

  return {
    nextSteps: [{
      summary: 'Add packages to your new monorepo',
      description: 'Leverage [@form8ion/add-package-to-monorepo](https://npm.im/@form8ion/add-package-to-monorepo)'
        + ' to scaffold new packages into your new monorepo'
    }]
  };
}
