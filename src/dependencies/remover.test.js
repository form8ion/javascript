import any from '@travi/any';
import {describe, it, expect, vi} from 'vitest';

import execa from '../../thirdparty-wrappers/execa.js';
import removeDependencies from './remover.js';

vi.mock('../../thirdparty-wrappers/execa.js');

describe('dependency remover', () => {
  it('should remove the dependencies using the named package manager', async () => {
    const packageManager = any.word();
    const dependencies = any.listOf(any.word);

    await removeDependencies({packageManager, dependencies});

    expect(execa).toHaveBeenCalledWith(packageManager, ['remove', ...dependencies]);
  });
});
