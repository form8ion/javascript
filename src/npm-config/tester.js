import {fileExists} from '@form8ion/core';

export default function npmConfigExists({projectRoot}) {
  return fileExists(`${projectRoot}/.npmrc`);
}
