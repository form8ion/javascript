import {fileExists} from '@form8ion/core';

export default async function ({projectRoot}) {
  return fileExists(`${projectRoot}/.nvmrc`);
}
