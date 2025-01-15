import {promises as fs} from 'node:fs';
import {execa} from 'execa';
import {writePackageJson} from '@form8ion/javascript-core';

export default async function ({projectRoot}) {
  const [packageContents, {stdout}] = await Promise.all([
    fs.readFile(`${projectRoot}/package.json`, 'utf-8'),
    execa('npm', ['--version'])
  ]);
  const existingPackageJsonContents = JSON.parse(packageContents);

  await writePackageJson({
    projectRoot,
    config: {
      ...existingPackageJsonContents,
      packageManager: `npm@${stdout}`
    }
  });
}
