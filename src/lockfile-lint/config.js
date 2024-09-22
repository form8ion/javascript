import {write as writeConfig, load as loadConfig} from '@form8ion/config-file';
import {fileTypes} from '@form8ion/core';

const configName = 'lockfile-lint';

export function read() {
  return loadConfig({name: configName});
}

export function write({projectRoot, config}) {
  return writeConfig({name: configName, format: fileTypes.JSON, path: projectRoot, config});
}
