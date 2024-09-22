import {read as readNpmConfig, write as writeNpmConfig} from '../npm-config/index.js';
import buildRegistriesConfig from './npm-config/list-builder.js';

export default async function ({projectRoot, configs}) {
  const registries = buildRegistriesConfig(configs.registries);

  await writeNpmConfig({
    projectRoot,
    config: {
      ...(await readNpmConfig({projectRoot})),
      ...registries
    }
  });

  return {};
}
