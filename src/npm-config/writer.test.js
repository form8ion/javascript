import {promises as fs} from 'node:fs';
import {stringify} from 'ini';

import {describe, expect, vi, it} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import write from './writer.js';

vi.mock('node:fs');
vi.mock('ini');

describe('npm config writer', () => {
  it('should write the .npmrc file', async () => {
    const projectRoot = any.string();
    const config = any.simpleObject();
    const stringifiedIniConfig = any.string();
    when(stringify).calledWith(config).thenReturn(stringifiedIniConfig);

    await write({projectRoot, config});

    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/.npmrc`, stringifiedIniConfig);
  });
});
