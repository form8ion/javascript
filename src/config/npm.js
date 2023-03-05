import {promises as fs} from 'fs';
import {stringify} from 'ini';
import {projectTypes} from '@form8ion/javascript-core';

function projectWillNotBeConsumed(projectType) {
  return projectTypes.APPLICATION === projectType || projectTypes.CLI === projectType;
}

export default async function ({
  projectRoot,
  projectType,
  registries
}) {
  await fs.writeFile(
    `${projectRoot}/.npmrc`,
    stringify({
      'update-notifier': false,
      ...projectWillNotBeConsumed(projectType) && {'save-exact': true},
      ...Object.fromEntries(Object.entries(registries)
        .filter(([scope]) => 'publish' !== scope)
        .map(([scope, url]) => {
          if ('registry' === scope) return ['registry', url];

          return [`@${scope}:registry`, url];
        }))
    })
  );

  return {scripts: {'lint:peer': 'npm ls >/dev/null'}};
}
