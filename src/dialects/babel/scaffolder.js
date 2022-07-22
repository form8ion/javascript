import {write} from './config';

export default async function ({projectRoot, preset, buildDirectory}) {
  if (!preset) {
    throw new Error('No babel preset provided. Cannot configure babel transpilation');
  }

  await write({projectRoot, config: {presets: [preset.name], ignore: [`./${buildDirectory}/`]}});

  return {
    devDependencies: ['@babel/register', preset.packageName],
    eslint: {}
  };
}
