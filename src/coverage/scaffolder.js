import deepmerge from 'deepmerge';
import {scaffold as scaffoldCodecov} from './codecov';
import scaffoldNyc from './nyc';

export default async function ({projectRoot, vcs, visibility}) {
  return deepmerge(await scaffoldNyc({projectRoot}), scaffoldCodecov({vcs, visibility}));
}
