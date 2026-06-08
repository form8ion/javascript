import {projectTypes, writeNpmrc} from '@form8ion/javascript-core';

function projectWillNotBeConsumed(projectType) {
  return projectTypes.APPLICATION === projectType || projectTypes.CLI === projectType;
}

export default async function scaffoldNpmConfiguration({projectRoot, projectType}) {
  await writeNpmrc({
    projectRoot,
    config: {'update-notifier': false, ...projectWillNotBeConsumed(projectType) && {'save-exact': true}}
  });

  return {scripts: {'lint:peer': 'npm ls >/dev/null'}};
}
