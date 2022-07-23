import {dialects} from '@form8ion/javascript-core';

import {scaffold as scaffoldBabel} from './babel';
import {scaffold as scaffoldTypescript} from './typescript';

export default function ({dialect, projectType, projectRoot, configs, testFilenamePattern}) {
  switch (dialect) {
    case dialects.BABEL:
      return scaffoldBabel({preset: configs.babelPreset, projectRoot});
    case dialects.TYPESCRIPT:
      return scaffoldTypescript({config: configs.typescript, projectType, projectRoot, testFilenamePattern});
    default:
      return {};
  }
}
