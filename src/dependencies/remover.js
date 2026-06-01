import {execa} from 'execa';

export default async function removeDependencies({packageManager, dependencies}, {logger}) {
  if (dependencies.length) {
    logger.info('Removing dependencies dependencies', {level: 'secondary'});

    await execa(packageManager, ['remove', ...dependencies]);
  }
}
