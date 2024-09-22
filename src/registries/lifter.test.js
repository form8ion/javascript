import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import {read as readNpmConfig, write as writeNpmConfig} from '../npm-config/index.js';
import buildRegistriesConfig from './npm-config/list-builder.js';
import liftRegistries from './lifter.js';

vi.mock('../registries/npm-config/list-builder.js');
vi.mock('../npm-config/index.js');

describe('registries lifter', () => {
  it('should define the registries in the npmrc and lockfile-lint configs', async () => {
    const projectRoot = any.string();
    const registries = any.simpleObject();
    const configs = {...any.simpleObject(), registries};
    const processedRegistryDetails = any.simpleObject();
    const existingNpmConfig = any.simpleObject();
    when(readNpmConfig).calledWith({projectRoot}).mockResolvedValue(existingNpmConfig);
    when(buildRegistriesConfig).calledWith(registries).mockReturnValue(processedRegistryDetails);

    expect(await liftRegistries({projectRoot, configs})).toEqual({});

    expect(writeNpmConfig).toHaveBeenCalledWith({
      projectRoot,
      config: {...existingNpmConfig, ...processedRegistryDetails}
    });
  });
});
