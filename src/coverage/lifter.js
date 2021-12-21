import {scaffold as scaffoldC8} from './c8';
import {test as nycIsConfigured, remove as removeNyc} from './nyc';

export async function lift({projectRoot}) {
  if (await nycIsConfigured({projectRoot})) {
    const [c8Results] = await Promise.all([
      scaffoldC8({projectRoot}),
      removeNyc({projectRoot})
    ]);

    return c8Results;
  }

  return {};
}
