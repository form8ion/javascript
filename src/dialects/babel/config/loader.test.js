import {fileTypes, loadConfigFile} from '@form8ion/core';

import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import loadConfig from './loader.js';

vi.mock('@form8ion/core');

describe('babel config loader', () => {
  it('should load config from an existing config file', async () => {
    const projectRoot = any.string();
    const parsedConfig = any.simpleObject();
    when(loadConfigFile)
      .calledWith({name: '.babelrc', format: fileTypes.JSON, path: projectRoot})
      .mockResolvedValue(parsedConfig);

    expect(await loadConfig({projectRoot})).toEqual(parsedConfig);
  });
});
