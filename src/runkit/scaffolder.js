import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

export default function scaffoldRunkit({projectRoot, visibility}) {
  if ('Public' !== visibility) return {};

  return mergeIntoExistingPackageJson({projectRoot, config: {runkitExampleFilename: './example.js'}});
}
