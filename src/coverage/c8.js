import {promises} from 'fs';

export default async function ({projectRoot}) {
  await promises.writeFile(
    `${projectRoot}/.c8rc.json`,
    JSON.stringify({
      reporter: ['lcov', 'text-summary', 'html'],
      exclude: ['src/**/*-test.js', 'test/', 'thirdparty-wrappers/', 'vendor/']
    })
  );

  return {
    devDependencies: ['cross-env', 'c8'],
    vcsIgnore: {files: [], directories: ['/coverage/']},
    eslint: {ignore: {directories: ['/coverage/']}}
  };
}
