import {write} from './config/index.js';

export default async function ({projectRoot, preset}) {
  if (!preset) {
    throw new Error('No babel preset provided. Cannot configure babel transpilation');
  }

  await write({projectRoot, config: {presets: [preset.name]}});

  return {
    dependencies: {javascript: {development: ['@babel/register', preset.packageName]}},
    eslint: {}
  };
}
