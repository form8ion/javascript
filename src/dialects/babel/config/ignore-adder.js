import writeConfig from './write.js';
import loadConfig from './loader.js';

export default async function ({projectRoot, ignore}) {
  if (ignore) {
    const existingConfig = await loadConfig();

    await writeConfig({projectRoot, config: {...existingConfig, ignore: [`./${ignore}/`]}});
  }
}
