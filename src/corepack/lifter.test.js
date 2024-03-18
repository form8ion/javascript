import {describe, it, vi, expect, afterEach} from 'vitest';

import execa from '../../thirdparty-wrappers/execa.js';
import liftCorepack from './lifter.js';

vi.mock('../../thirdparty-wrappers/execa.js');

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
