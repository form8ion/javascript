import {load} from '@form8ion/config-file';

import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';

import loadConfig from './loader.js';
import {when} from 'jest-when';

vi.mock('@form8ion/config-file');

describe('babel config loader', () => {
  it('should load config from an existing config file', async () => {
    const parsedConfig = any.simpleObject();
    when(load).calledWith({name: 'babel'}).mockResolvedValue(parsedConfig);

    expect(await loadConfig()).toEqual(parsedConfig);
  });
});
