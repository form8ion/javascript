import {test as testForEslint} from '@form8ion/eslint';

import {test as testForRemark} from './remark/index.js';

export default async function (options) {
  const [eslintIsUsed, remarkIsUsed] = await Promise.all([testForEslint(options), testForRemark(options)]);

  return eslintIsUsed || remarkIsUsed;
}
