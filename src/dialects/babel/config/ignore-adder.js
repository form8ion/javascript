import {promises as fs} from 'fs';

import writeConfig from './write';

export default async function ({projectRoot, ignore}) {
  if (ignore) {
    const existingConfig = JSON.parse(await fs.readFile(`${projectRoot}/.babelrc.json`, 'utf-8'));

    await writeConfig({projectRoot, config: {...existingConfig, ignore: [`./${ignore}/`]}});
  }
}
