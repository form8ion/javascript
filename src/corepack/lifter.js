import execa from '../../thirdparty-wrappers/execa.js';

export default async function () {
  await execa('corepack', ['use', 'npm@latest']);
}
