import {fileTypes, loadConfigFile} from '@form8ion/core';
import {write as writeConfig} from '@form8ion/config-file';

import {when} from 'jest-when';
import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import {read, write} from './config.js';

vi.mock('@form8ion/core');
vi.mock('@form8ion/config-file');

describe('lockfile-lint config', () => {
  const projectRoot = any.string();

  it('should read the config file', async () => {
    const config = any.simpleObject();
    when(loadConfigFile)
      .calledWith({name: '.lockfile-lintrc', format: fileTypes.JSON, path: projectRoot})
      .mockResolvedValue(config);

    expect(await read({projectRoot})).toEqual(config);
  });

  it('should write the config file', async () => {
    const config = any.simpleObject();

    await write({projectRoot, config});

    expect(writeConfig).toHaveBeenCalledWith({
      name: 'lockfile-lint',
      format: fileTypes.JSON,
      path: projectRoot,
      config
    });
  });
});
