import {fileExists} from '@form8ion/core';

export default function nodeVersionMangerInUse({projectRoot}) {
  return fileExists(`${projectRoot}/.nvmrc`);
}
