import deepmerge from 'deepmerge';
import {scaffold as scaffoldCodecov} from '@form8ion/codecov';

import {scaffold as scaffoldC8} from './c8/index.js';

export default async function ({projectRoot, vcs, visibility, pathWithinParent}) {
  return deepmerge(await scaffoldC8({projectRoot}), await scaffoldCodecov({vcs, visibility, pathWithinParent}));
}
