import {fileTypes, loadConfigFile} from '@form8ion/core';

export default function loadBabelConfig({projectRoot}) {
  return loadConfigFile({path: projectRoot, name: '.babelrc', format: fileTypes.JSON});
}
