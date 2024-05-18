import {promises as fs} from 'node:fs';
import {stringify} from 'ini';

export default async function ({projectRoot, config}) {
  await fs.writeFile(`${projectRoot}/.npmrc`, stringify(config));
}
