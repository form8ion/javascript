import execa from '../../thirdparty-wrappers/execa.js';

export default async function ({packageManager, dependencies}) {
  await execa(packageManager, ['remove', ...dependencies]);
}
