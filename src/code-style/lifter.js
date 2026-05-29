import {applyEnhancers} from '@form8ion/core';
import * as eslintPlugin from '@form8ion/eslint';

export default function liftCodeStyle(options, dependencies) {
  return applyEnhancers({options, enhancers: [eslintPlugin], dependencies});
}
