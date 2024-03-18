import {lift as liftCorepack} from '../corepack/index.js';

export default async function () {
  await liftCorepack();

  return {};
}
