import {promises as fs} from 'node:fs';
import {parse, stringify} from 'ini';

export default async function ({projectRoot}) {
  const pathToConfig = `${projectRoot}/.npmrc`;

  const {
    provenance,
    'engines-strict': enginesStrict,
    ...remainingProperties
  } = parse(await fs.readFile(pathToConfig, 'utf-8'));

  await fs.writeFile(pathToConfig, stringify(remainingProperties));

  return {};
}
