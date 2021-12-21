import {promises as fs} from 'fs';

export default async function ({projectRoot}) {
  await Promise.all([
    fs.unlink(`${projectRoot}/.nycrc`),
    fs.rm(`${projectRoot}/.nyc_output`, {recursive: true, force: true})
  ]);
}
