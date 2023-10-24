import {scaffoldChoice as scaffoldChosenBundler} from '@form8ion/javascript-core';
import chooseBundler from './prompt.js';

export default async function ({projectRoot, projectType, bundlers, dialect, decisions}) {
  const chosenBundler = await chooseBundler({bundlers, decisions});

  return scaffoldChosenBundler(bundlers, chosenBundler, {projectRoot, projectType, dialect});
}
