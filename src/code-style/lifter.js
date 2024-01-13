import {applyEnhancers} from '@form8ion/core';
import * as eslintPlugin from '@form8ion/eslint';

export default function (options) {
  return applyEnhancers({options, enhancers: [eslintPlugin]});
}
