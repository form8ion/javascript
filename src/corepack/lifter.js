import {execa} from 'execa';

export default async function () {
  await execa('corepack', ['use', 'npm@latest']);
}
