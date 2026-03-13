import {fileExists} from '@form8ion/core';

export default function nyvInUse({projectRoot}) {
  return fileExists(`${projectRoot}/.nycrc`);
}
