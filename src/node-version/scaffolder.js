import {promises as fs} from 'node:fs';

import {determineLatestVersionOf, install as installNodeVersion} from './tasks.js';

export default async function scaffoldNodeVersion({projectRoot, nodeVersionCategory}, {logger}) {
  if (!nodeVersionCategory) return undefined;

  const lowerCaseCategory = nodeVersionCategory.toLowerCase();
  logger.info(`Configuring ${lowerCaseCategory} version of node`);

  const version = await determineLatestVersionOf(nodeVersionCategory, {logger});

  await fs.writeFile(`${projectRoot}/.nvmrc`, version);

  await installNodeVersion(nodeVersionCategory, {logger});

  return version;
}
