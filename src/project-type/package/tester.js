import {promises as fs} from 'node:fs';

export default async function ({projectRoot}) {
  const {exports, publishConfig, bin} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));

  return !!exports || (!!publishConfig && !bin);
}
