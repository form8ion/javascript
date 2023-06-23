import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

export default async function ({projectRoot}) {
  await mergeIntoExistingPackageJson({projectRoot, config: {publishConfig: {provenance: true}}});

  return {
    devDependencies: ['publint'],
    scripts: {'lint:publish': 'publint --strict'}
  };
}
