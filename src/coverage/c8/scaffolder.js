import {write} from '@form8ion/config-file';
import {fileTypes} from '@form8ion/core';

export default async function ({projectRoot}) {
  await write({
    name: 'c8',
    format: fileTypes.JSON,
    path: projectRoot,
    config: {
      reporter: ['lcov', 'text-summary', 'html'],
      exclude: ['src/**/*-test.js', 'test/', 'thirdparty-wrappers/', 'vendor/']
    }
  });

  return {
    devDependencies: ['cross-env', 'c8'],
    vcsIgnore: {files: [], directories: ['/coverage/']},
    eslint: {ignore: {directories: ['/coverage/']}}
  };
}
