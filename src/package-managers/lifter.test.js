import {describe, it, vi, expect, afterEach} from 'vitest';

import {lift as liftCorepack} from '../corepack/index.js';
import liftPackageManger from './lifter.js';

vi.mock('../corepack/index.js');

describe('package-manager lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift package-manager details', async () => {
    await liftPackageManger();

    expect(liftCorepack).toHaveBeenCalled();
  });
});
