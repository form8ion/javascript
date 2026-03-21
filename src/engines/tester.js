import {promises as fs} from 'fs';

export default async function testEngines({projectRoot}) {
  const {engines} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf8'));

  return !!engines?.node;
}
