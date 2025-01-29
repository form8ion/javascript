import {promises as fs} from 'node:fs';
import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {writePackageJson} from '@form8ion/javascript-core';

import sortPackageProperties from './property-sorter.js';
import defineVcsHostDetails from './vcs-host-details.js';
import {process as processDependencies} from '../dependencies/index.js';
import {lift as liftScripts} from './scripts/index.js';

export default async function ({
  projectRoot,
  scripts,
  tags,
  dependencies,
  devDependencies,
  packageManager,
  vcs,
  pathWithinParent
}) {
  info('Updating `package.json`', {level: 'secondary'});

  const existingPackageJsonContents = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));
  const {scripts: liftedScripts, dependencies: scriptDependencies} = liftScripts({
    existingScripts: existingPackageJsonContents.scripts,
    scripts
  });

  await writePackageJson({
    projectRoot,
    config: sortPackageProperties({
      ...existingPackageJsonContents,
      ...defineVcsHostDetails(vcs, pathWithinParent),
      scripts: liftedScripts,
      ...tags && {
        keywords: existingPackageJsonContents.keywords ? [...existingPackageJsonContents.keywords, ...tags] : tags
      }
    })
  });

  await processDependencies({
    dependencies: deepmerge(dependencies, scriptDependencies),
    devDependencies,
    projectRoot,
    packageManager
  });
}
