import execa from '../../thirdparty-wrappers/execa';

export default async function ({packageManager, dependencies}) {
  await execa(packageManager, ['remove', ...dependencies]);
}
