import {loadNpmrc, writeNpmrc} from '@form8ion/javascript-core';

export default async function liftNpmConfig({projectRoot}) {
  const {
    provenance,
    'engines-strict': enginesStrict,
    ...remainingProperties
  } = await loadNpmrc({projectRoot});

  await writeNpmrc({projectRoot, config: remainingProperties});

  return {};
}
