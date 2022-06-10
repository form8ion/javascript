import {fileTypes, writeConfigFile, mergeIntoExistingConfigFile} from '@form8ion/core';

export function write({projectRoot, config}) {
  return writeConfigFile({format: fileTypes.JSON, name: 'package', path: projectRoot, config});
}

export async function mergeIntoExisting({projectRoot, config}) {
  return mergeIntoExistingConfigFile({format: fileTypes.JSON, name: 'package', path: projectRoot, config});
}
