import {projectTypes} from '@form8ion/javascript-core';

import buildRegistriesConfig from '../registries/npm-config/list-builder.js';
import write from './writer.js';

function projectWillNotBeConsumed(projectType) {
  return projectTypes.APPLICATION === projectType || projectTypes.CLI === projectType;
}

export default async function ({
  projectRoot,
  projectType,
  registries
}) {
  await write({
    projectRoot,
    config: {
      'update-notifier': false,
      ...projectWillNotBeConsumed(projectType) && {'save-exact': true},
      ...buildRegistriesConfig(registries)
    }
  });

  return {scripts: {'lint:peer': 'npm ls >/dev/null'}};
}
