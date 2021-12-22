import {promises as fs} from 'fs';
import removeDependencies from '../../dependencies/remover';

export default async function ({projectRoot, packageManager}) {
  await Promise.all([
    fs.unlink(`${projectRoot}/.nycrc`),
    fs.rmdir(`${projectRoot}/.nyc_output`, {recursive: true, force: true}),
    removeDependencies({packageManager, dependencies: ['nyc', '@istanbuljs/nyc-config-babel']})
  ]);
}
