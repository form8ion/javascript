import {fileTypes, loadConfigFile} from '@form8ion/core';
import {write as writeConfig} from '@form8ion/config-file';

const configName = 'lockfile-lint';

export function read({projectRoot}) {
  return loadConfigFile({name: `.${configName}rc`, format: fileTypes.JSON, path: projectRoot});
}

export function write({projectRoot, config}) {
  return writeConfig({name: configName, format: fileTypes.JSON, path: projectRoot, config});
}
