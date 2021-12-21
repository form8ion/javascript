import {promises as fs} from 'fs';

export default async function ({projectRoot}) {
  await Promise.all([
    fs.unlink(`${projectRoot}/.nycrc`),
    fs.rmdir(`${projectRoot}/.nyc_output`, {recursive: true, force: true})
  ]);
}
