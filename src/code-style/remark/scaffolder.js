import deepmerge from 'deepmerge';
import {fileTypes} from '@form8ion/core';
import {projectTypes} from '@form8ion/javascript-core';
import {write} from '@form8ion/config-file';

export default async function ({config, projectRoot, projectType, vcs}) {
  await write({
    format: fileTypes.JSON,
    path: projectRoot,
    name: 'remark',
    config: {
      settings: {
        listItemIndent: 'one',
        emphasis: '_',
        strong: '_',
        bullet: '*',
        incrementListMarker: false
      },
      plugins: [
        config,
        ['remark-toc', {tight: true}],
        ...projectTypes.PACKAGE === projectType ? [['remark-usage', {heading: 'example'}]] : [],
        ...!vcs ? [['validate-links', {repository: false}]] : []
      ]
    }
  });

  return deepmerge(
    {
      devDependencies: [config, 'remark-cli', 'remark-toc'],
      scripts: {
        'lint:md': 'remark . --frail',
        'generate:md': 'remark . --output'
      }
    },
    {...projectTypes.PACKAGE === projectType && {devDependencies: ['remark-usage']}}
  );
}
