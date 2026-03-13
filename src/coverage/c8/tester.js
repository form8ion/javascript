import {fileExists} from '@form8ion/core';

export default function c8InUse({projectRoot}) {
  return fileExists(`${projectRoot}/.c8rc.json`);
}
