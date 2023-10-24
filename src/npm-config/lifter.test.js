import {promises as fs} from 'node:fs';
import {stringify} from 'ini';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import liftNpmConfig from './lifter.js';

vi.mock('node:fs');

describe('npm config lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should remove `provenance` and `engines-strict` properties from the config', async () => {
    const projectRoot = any.string();
    const desiredProperties = any.simpleObject();
    const pathToConfig = `${projectRoot}/.npmrc`;
    when(fs.readFile)
      .calledWith(pathToConfig, 'utf-8')
      .mockReturnValue(stringify({...desiredProperties, provenance: true, 'engines-strict': true}));

    expect(await liftNpmConfig({projectRoot})).toEqual({});
    expect(fs.writeFile).toHaveBeenCalledWith(pathToConfig, stringify(desiredProperties));
  });
});
