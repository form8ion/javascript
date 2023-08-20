import {fileExists} from '@form8ion/core';

export default async function ({projectRoot}) {
  const [jsonConfigExists, jsConfigExists, cjsConfigExists] = await Promise.all([
    fileExists(`${projectRoot}/.remarkrc.json`),
    fileExists(`${projectRoot}/.remarkrc.js`),
    fileExists(`${projectRoot}/.remarkrc.cjs`)
  ]);

  return jsonConfigExists || jsConfigExists || cjsConfigExists;
}
