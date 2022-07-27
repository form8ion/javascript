import {scaffold} from '@form8ion/eslint';

export default async function ({config, projectRoot, additionalConfiguration}) {
  const {scope} = config;
  const {ignore} = additionalConfiguration;

  return scaffold({scope, projectRoot, ignore});
}
