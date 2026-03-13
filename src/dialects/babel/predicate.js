import {fileExists} from '@form8ion/core';

export default function babelIsInUse({projectRoot}) {
  return fileExists(`${projectRoot}/.babelrc.json`);
}
