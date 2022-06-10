import {dialects} from '@form8ion/javascript-core';

import {scaffold as scaffoldBabel} from './babel';
import {scaffold as scaffoldTypescript} from './typescript';

export default function ({dialect, projectType, projectRoot, configs, buildDirectory, testFilenamePattern}) {
  switch (dialect) {
    case dialects.BABEL:
      return scaffoldBabel({preset: configs.babelPreset, projectRoot, buildDirectory});
    case dialects.TYPESCRIPT:
      return scaffoldTypescript({config: configs.typescript, projectType, projectRoot, testFilenamePattern});
    default:
      return {};
  }
}
