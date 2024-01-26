import {promises as fs} from 'node:fs';

import any from '@travi/any';
import {when} from 'jest-when';
import {afterEach, describe, expect, it, vi} from 'vitest';

import writeConfig from './write.js';
import addIgnore from './ignore-adder.js';

vi.mock('node:fs');
vi.mock('./write.js');

describe('babel ignore adder', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add the provided ignore to the existing config', async () => {
    const pathToIgnore = any.string();
    const existingConfig = any.simpleObject();
    when(fs.readFile)
      .calledWith(`${projectRoot}/.babelrc.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(existingConfig));

    await addIgnore({projectRoot, ignore: pathToIgnore});

    expect(writeConfig)
      .toHaveBeenCalledWith({projectRoot, config: {...existingConfig, ignore: [`./${pathToIgnore}/`]}});
  });

  it('should not update the config if no `buildDirectory` is provided', async () => {
    await addIgnore({projectRoot});

    expect(fs.readFile).not.toHaveBeenCalled();
    expect(writeConfig).not.toHaveBeenCalled();
  });
});
