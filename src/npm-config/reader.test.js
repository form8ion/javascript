import {promises as fs} from 'node:fs';
import {stringify} from 'ini';
import {fileExists} from '@form8ion/core';

import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import readConfig from './reader.js';

vi.mock('node:fs');
vi.mock('@form8ion/core');

describe('npm config reader', () => {
  const projectRoot = any.string();
  const pathToConfig = `${projectRoot}/.npmrc`;

  it('should read the .npmrc file', async () => {
    const existingProperties = any.simpleObject();
    when(fileExists).calledWith(pathToConfig).mockResolvedValue(true);
    when(fs.readFile)
      .calledWith(pathToConfig, 'utf-8')
      .mockReturnValue(stringify(existingProperties));

    expect(await readConfig({projectRoot})).toEqual(existingProperties);
  });

  it('should return empty when the file does not exist', async () => {
    when(fileExists).calledWith(pathToConfig).mockResolvedValue(false);

    expect(await readConfig({projectRoot})).toEqual({});
  });
});
