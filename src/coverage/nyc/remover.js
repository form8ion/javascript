import {promises as fs} from 'fs';

export default async function ({projectRoot}) {
  await fs.unlink(`${projectRoot}/.nycrc`);
}
