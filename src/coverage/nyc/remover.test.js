import {promises as fs} from 'node:fs';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';

import removeDependencies from '../../dependencies/remover.js';
import removeNyc from './remover.js';

vi.mock('node:fs');
vi.mock('../../dependencies/remover.js');

describe('nyc remover', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should remove configuration and dependencies', async () => {
    const projectRoot = any.string();
    const packageManager = any.word();

    await removeNyc({projectRoot, packageManager});

    expect(fs.unlink).toHaveBeenCalledWith(`${projectRoot}/.nycrc`);
    expect(fs.rm).toHaveBeenCalledWith(`${projectRoot}/.nyc_output`, {recursive: true, force: true});
    expect(removeDependencies).toHaveBeenCalledWith({
      packageManager,
      dependencies: ['nyc', '@istanbuljs/nyc-config-babel', 'babel-plugin-istanbul']
    });
  });
});
