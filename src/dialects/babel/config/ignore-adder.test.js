import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import writeConfig from './writer.js';
import loadConfig from './loader.js';
import addIgnore from './ignore-adder.js';

vi.mock('node:fs');
vi.mock('./writer.js');
vi.mock('./loader.js');

describe('babel ignore adder', () => {
  const projectRoot = any.string();

  it('should add the provided ignore to the existing config', async () => {
    const pathToIgnore = any.string();
    const existingConfig = any.simpleObject();
    loadConfig.mockResolvedValue(existingConfig);

    await addIgnore({projectRoot, ignore: pathToIgnore});

    expect(writeConfig)
      .toHaveBeenCalledWith({projectRoot, config: {...existingConfig, ignore: [`./${pathToIgnore}/`]}});
  });

  it('should not update the config if no `buildDirectory` is provided', async () => {
    await addIgnore({projectRoot});

    expect(loadConfig).not.toHaveBeenCalled();
    expect(writeConfig).not.toHaveBeenCalled();
  });
});
