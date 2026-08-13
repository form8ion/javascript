import {scaffoldChoice as scaffoldChosenBundler} from '@form8ion/javascript-core';
import chooseBundler from './prompt.js';

export default async function scaffoldBundler({projectRoot, projectType, bundlers, dialect}, {prompt}) {
  const chosenBundler = await chooseBundler({bundlers}, {prompt});

  return scaffoldChosenBundler(bundlers, chosenBundler, {projectRoot, projectType, dialect});
}
