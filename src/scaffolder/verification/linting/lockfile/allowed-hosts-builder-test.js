import {assert} from 'chai';
import any from '@travi/any';

import buildAllowedHostsList from './allowed-hosts-builder';

suite('allowed-hosts builder', () => {
  const packageManager = any.word();

  test('that the package-manager is listed in the allowed list', async () => {
    assert.deepEqual(buildAllowedHostsList({packageManager}), [packageManager]);
  });

  test('that additional registries are allowed when provided', async () => {
    const registries = any.simpleObject();

    assert.deepEqual(
      buildAllowedHostsList({packageManager, registries}),
      [packageManager, ...Object.values(registries)]
    );
  });

  test('that the package-manager is not listed if the provided registries override the official registry', async () => {
    const registry = any.url();

    assert.deepEqual(
      buildAllowedHostsList({packageManager, registries: {registry}}),
      [registry]
    );
  });
});
