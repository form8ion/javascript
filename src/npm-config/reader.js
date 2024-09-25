import {parse} from 'ini';
import {promises as fs} from 'node:fs';
import {fileExists} from '@form8ion/core';

export default async function ({projectRoot}) {
  const pathToConfig = `${projectRoot}/.npmrc`;

  if (!(await fileExists(pathToConfig))) return {};

  return parse(await fs.readFile(pathToConfig, 'utf-8'));
}
