import {execa} from 'execa';

import {describe, it, vi, expect, afterEach} from 'vitest';

import liftCorepack from './lifter.js';

vi.mock('execa');

describe('corepack lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it(
    'should set the `packageManager` package.json property to the latest version of the current package manager',
    async () => {
      await liftCorepack();

      expect(execa).toHaveBeenCalledWith('corepack', ['use', 'npm@latest']);
    }
  );
});
