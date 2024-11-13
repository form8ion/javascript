import {execa} from 'execa';

export default async function ({packageManager, dependencies}) {
  await execa(packageManager, ['remove', ...dependencies]);
}
