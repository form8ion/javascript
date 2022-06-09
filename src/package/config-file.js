import {fileTypes, writeConfigFile} from '@form8ion/core';

export function write({projectRoot, config}) {
  return writeConfigFile({format: fileTypes.JSON, name: 'package', path: projectRoot, config});
}
