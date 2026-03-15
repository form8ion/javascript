import deepmerge from 'deepmerge';
import {scaffold as scaffoldCodecov} from '@form8ion/codecov';
import {scaffold as scaffoldC8} from '@form8ion/c8';

export default async function scaffoldCoverage({projectRoot, vcs, visibility, pathWithinParent}) {
  return deepmerge(await scaffoldC8({projectRoot}), await scaffoldCodecov({vcs, visibility, pathWithinParent}));
}
