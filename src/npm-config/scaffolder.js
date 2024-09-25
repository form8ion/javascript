import {projectTypes} from '@form8ion/javascript-core';

import write from './writer.js';

function projectWillNotBeConsumed(projectType) {
  return projectTypes.APPLICATION === projectType || projectTypes.CLI === projectType;
}

export default async function ({projectRoot, projectType}) {
  await write({
    projectRoot,
    config: {'update-notifier': false, ...projectWillNotBeConsumed(projectType) && {'save-exact': true}}
  });

  return {scripts: {'lint:peer': 'npm ls >/dev/null'}};
}
