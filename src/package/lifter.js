import {promises as fs} from 'fs';
import {error, info} from '@travi/cli-messages';
import {DEV_DEPENDENCY_TYPE, PROD_DEPENDENCY_TYPE, writePackageJson} from '@form8ion/javascript-core';

import sortPackageProperties from './property-sorter.js';
import {install} from '../dependencies/index.js';
import {lift as liftScripts} from './scripts/index.js';

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

    await writePackageJson({
      projectRoot,
      config: sortPackageProperties({
        ...existingPackageJsonContents,
        scripts: liftScripts({existingScripts: existingPackageJsonContents.scripts, scripts}),
        ...tags && {
          keywords: existingPackageJsonContents.keywords ? [...existingPackageJsonContents.keywords, ...tags] : tags
        }
      })
    });
  }

  info('Installing dependencies');

  try {
    await install(dependencies || [], PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    await install([...devDependencies || []], DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
  } catch (e) {
    error('Failed to install dependencies');
    error(e, {level: 'secondary'});
  }
}
