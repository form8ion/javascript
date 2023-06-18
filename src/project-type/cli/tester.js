import {promises as fs} from 'node:fs';

export default async function ({projectRoot}) {
  const {bin} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));

  return !!bin;
}
