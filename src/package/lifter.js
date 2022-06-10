import {promises as fs} from 'fs';
import {error, info} from '@travi/cli-messages';
import {DEV_DEPENDENCY_TYPE, installDependencies, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

import {lift as liftScripts} from './scripts';
import {write} from './config-file';

export default async function ({
  projectRoot,
  scripts,
  tags,
  dependencies,
  devDependencies,
  packageManager
}) {
  if (scripts || tags) {
    info('Updating `package.json`', {level: 'secondary'});

    const pathToPackageJson = `${projectRoot}/package.json`;

    const existingPackageJsonContents = JSON.parse(await fs.readFile(pathToPackageJson, 'utf8'));

    await write({
      projectRoot,
      config: {
        ...existingPackageJsonContents,
        scripts: liftScripts({existingScripts: existingPackageJsonContents.scripts, scripts}),
        ...tags && {
          keywords: existingPackageJsonContents.keywords ? [...existingPackageJsonContents.keywords, ...tags] : tags
        }
      }
    });
  }

  info('Installing dependencies');

  try {
    await installDependencies(dependencies || [], PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    await installDependencies([...devDependencies || []], DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
  } catch (e) {
    error('Failed to install dependencies');
  }
}
