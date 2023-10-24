import c8IsConfigured from './c8/tester.js';
import nycIsConfigured from './nyc/tester.js';

export default async function ({projectRoot}) {
  const [c8Exists, nycExists] = await Promise.all([c8IsConfigured({projectRoot}), nycIsConfigured({projectRoot})]);

  return c8Exists || nycExists;
}
