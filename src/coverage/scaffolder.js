import deepmerge from 'deepmerge';
import {scaffold as scaffoldCodecov} from '@form8ion/codecov';
import scaffoldC8 from './c8';

export default async function ({projectRoot, vcs, visibility}) {
  return deepmerge(await scaffoldC8({projectRoot}), scaffoldCodecov({vcs, visibility}));
}
