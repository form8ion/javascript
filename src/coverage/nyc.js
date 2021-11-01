import {promises} from 'fs';

export default async function ({projectRoot}) {
  await promises.writeFile(
    `${projectRoot}/.nycrc`,
    JSON.stringify({
      extends: '@istanbuljs/nyc-config-babel',
      reporter: ['lcov', 'text-summary', 'html'],
      exclude: ['src/**/*-test.js', 'test/', 'thirdparty-wrappers/', 'vendor/']
    })
  );

  return {
    devDependencies: ['cross-env', 'nyc', '@istanbuljs/nyc-config-babel'],
    vcsIgnore: {files: [], directories: ['/coverage/', '/.nyc_output/']},
    eslint: {ignore: {directories: ['/coverage/']}}
  };
}
