import {promises as fsPromises} from 'fs';

export default async function ({projectRoot, preset, buildDirectory}) {
  if (!preset) {
    throw new Error('No babel preset provided. Cannot configure babel transpilation');
  }

  await fsPromises.writeFile(
    `${projectRoot}/.babelrc`,
    JSON.stringify({presets: [preset.name], ignore: [`./${buildDirectory}/`]})
  );

  return {
    devDependencies: ['@babel/register', preset.packageName],
    eslint: {}
  };
}
