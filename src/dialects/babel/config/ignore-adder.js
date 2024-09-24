import writeConfig from './writer.js';
import loadConfig from './loader.js';

export default async function ({projectRoot, ignore}) {
  if (ignore) {
    const existingConfig = await loadConfig({projectRoot});

    await writeConfig({projectRoot, config: {...existingConfig, ignore: [`./${ignore}/`]}});
  }
}
