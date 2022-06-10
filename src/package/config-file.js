import {promises as fs} from 'fs';
import deepmerge from 'deepmerge';
import {fileTypes, writeConfigFile} from '@form8ion/core';

export function write({projectRoot, config}) {
  return writeConfigFile({format: fileTypes.JSON, name: 'package', path: projectRoot, config});
}

export async function mergeIntoExisting({projectRoot, config}) {
  const existingConfig = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));

  return write({projectRoot, config: deepmerge.all([existingConfig, config])});
}
