import {fileTypes} from '@form8ion/core';
import {write as writeConfig, load as loadConfig} from '@form8ion/config-file';

import {when} from 'jest-when';
import any from '@travi/any';
import {it, expect, describe, vi} from 'vitest';

import {read, write} from './config.js';

vi.mock('@form8ion/config-file');

describe('lockfile-lint config', () => {
  it('should read the config file', async () => {
    const config = any.simpleObject();
    when(loadConfig).calledWith({name: 'lockfile-lint'}).mockResolvedValue(config);

    expect(await read()).toEqual(config);
  });

  it('should write the config file', async () => {
    const projectRoot = any.string();
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
