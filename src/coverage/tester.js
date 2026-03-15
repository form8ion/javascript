import {test as c8IsConfigured} from '@form8ion/c8';

import nycIsConfigured from './nyc/tester.js';

export default async function testCoverageBeingCollected({projectRoot}) {
  const [c8Exists, nycExists] = await Promise.all([c8IsConfigured({projectRoot}), nycIsConfigured({projectRoot})]);

  return c8Exists || nycExists;
}
