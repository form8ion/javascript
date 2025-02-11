import {promises as fs} from 'node:fs';

export default async function ({projectRoot}) {
  await Promise.all([
    fs.unlink(`${projectRoot}/.nycrc`),
    fs.rm(`${projectRoot}/.nyc_output`, {recursive: true, force: true})
  ]);

  return {
    dependencies: {
      javascript: {
        remove: ['nyc', '@istanbuljs/nyc-config-babel', 'babel-plugin-istanbul']
      }
    }
  };
}
