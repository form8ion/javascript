import read from './reader.js';
import write from './writer.js';

export default async function ({projectRoot}) {
  const {
    provenance,
    'engines-strict': enginesStrict,
    ...remainingProperties
  } = await read({projectRoot});

  await write({projectRoot, config: remainingProperties});

  return {};
}
