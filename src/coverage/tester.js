import c8IsConfigured from './c8/tester';
import nycIsConfigured from './nyc/tester';

export default async function ({projectRoot}) {
  const [c8Exists, nycExists] = await Promise.all([c8IsConfigured({projectRoot}), nycIsConfigured({projectRoot})]);

  return c8Exists || nycExists;
}
