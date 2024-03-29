import {promises as fs} from 'node:fs';
import {info} from '@travi/cli-messages';

import {determineLatestVersionOf, install as installNodeVersion} from './tasks.js';

export default async function ({projectRoot, nodeVersionCategory}) {
  if (!nodeVersionCategory) return undefined;

  const lowerCaseCategory = nodeVersionCategory.toLowerCase();
  info(`Configuring ${lowerCaseCategory} version of node`);

  const version = await determineLatestVersionOf(nodeVersionCategory);

  await fs.writeFile(`${projectRoot}/.nvmrc`, version);

  await installNodeVersion(nodeVersionCategory);

  return version;
}
