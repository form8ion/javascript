import deepmerge from 'deepmerge';
import {lift as liftEslint} from '@form8ion/eslint';

import {lift as liftRemark} from './remark/index.js';

export default async function (options) {
  return deepmerge.all(await Promise.all([liftEslint(options), liftRemark(options)]));
}
