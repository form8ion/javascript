import {promises as fs} from 'node:fs';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';

import removeNyc from './remover.js';

vi.mock('node:fs');

describe('nyc remover', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should remove configuration and dependencies', async () => {
    const projectRoot = any.string();

    const {dependencies} = await removeNyc({projectRoot});

    expect(fs.unlink).toHaveBeenCalledWith(`${projectRoot}/.nycrc`);
    expect(fs.rm).toHaveBeenCalledWith(`${projectRoot}/.nyc_output`, {recursive: true, force: true});
    expect(dependencies.javascript.remove).toEqual(['nyc', '@istanbuljs/nyc-config-babel', 'babel-plugin-istanbul']);
  });
});
