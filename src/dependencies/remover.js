import {execa} from 'execa';
import {info} from '@travi/cli-messages';

export default async function ({packageManager, dependencies}) {
  if (dependencies.length) {
    info('Removing dependencies dependencies', {level: 'secondary'});

    await execa(packageManager, ['remove', ...dependencies]);
  }
}
