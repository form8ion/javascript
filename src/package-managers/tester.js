import {test as npmIsUsed} from './npm/index.js';
import {test as yarnIsUsed} from './yarn/index.js';

export default async function ({projectRoot}) {
  const [npmFound, yarnFound] = await Promise.all([
    npmIsUsed({projectRoot}),
    yarnIsUsed({projectRoot})
  ]);

  return npmFound || yarnFound;
}
