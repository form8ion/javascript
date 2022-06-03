import {write} from '@form8ion/config-file';
import {fileTypes} from '@form8ion/core';

export default async function ({projectRoot, preset, buildDirectory}) {
  if (!preset) {
    throw new Error('No babel preset provided. Cannot configure babel transpilation');
  }

  await write({
    path: projectRoot,
    name: 'babel',
    format: fileTypes.JSON,
    config: {presets: [preset.name], ignore: [`./${buildDirectory}/`]}
  });

  return {
    devDependencies: ['@babel/register', preset.packageName],
    eslint: {}
  };
}
