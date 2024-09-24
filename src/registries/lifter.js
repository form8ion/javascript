import {
  scaffold as scaffoldLockfileLint,
  test as lockfileLintIsAlreadyConfigured,
  read as readLockfileLintConfig,
  write as writeLockfileLintConfig
} from '../lockfile-lint/index.js';
import {read as readNpmConfig, write as writeNpmConfig} from '../npm-config/index.js';
import buildRegistriesConfig from './npm-config/list-builder.js';
import buildAllowedHostsList from '../lockfile-lint/allowed-hosts-builder.js';

async function updateRegistriesInNpmConfig(registries, projectRoot) {
  const registriesForNpmConfig = buildRegistriesConfig(registries);

  await writeNpmConfig({
    projectRoot,
    config: {
      ...(await readNpmConfig({projectRoot})),
      ...registriesForNpmConfig
    }
  });
}

async function updateRegistriesInLockfileLintConfig(projectRoot, packageManager, registries) {
  await writeLockfileLintConfig({
    projectRoot,
    config: {
      ...await readLockfileLintConfig({projectRoot}),
      'allowed-hosts': buildAllowedHostsList({packageManager, registries})
    }
  });
}

export default async function ({projectRoot, packageManager, configs: {registries}}) {
  await updateRegistriesInNpmConfig(registries, projectRoot);

  if (!(await lockfileLintIsAlreadyConfigured({projectRoot}))) {
    return scaffoldLockfileLint({projectRoot, packageManager, registries});
  }

  await updateRegistriesInLockfileLintConfig(projectRoot, packageManager, registries);

  return {};
}
