import {fileExists} from '@form8ion/core';

export default function lockfileLintInUse({projectRoot}) {
  return fileExists(`${projectRoot}/.lockfile-lintrc.json`);
}
