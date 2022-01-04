import {fileExists} from '@form8ion/core';

export default function ({projectRoot}) {
  return fileExists(`${projectRoot}/.c8rc.json`);
}
