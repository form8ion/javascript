import {execa} from 'execa';

export default async function liftCorepack() {
  await execa('corepack', ['use', 'npm@latest']);
}
