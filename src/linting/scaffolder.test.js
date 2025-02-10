import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as scaffoldLockfileLint} from '../lockfile-lint/index.js';
import {scaffold} from './index.js';

vi.mock('../lockfile-lint');

describe('linting scaffolder', () => {
  const pathWithinParent = any.string();
  const projectRoot = any.string();
  const packageManager = any.word();
  const vcs = any.simpleObject();
  const registries = any.simpleObject();

  it('should configure linters when config definitions are provided', async () => {
    const lockfileLintResults = any.simpleObject();
    when(scaffoldLockfileLint)
      .calledWith({projectRoot, packageManager, registries})
      .mockResolvedValue(lockfileLintResults);

    expect(await scaffold({
      projectRoot,
      vcs,
      packageManager,
      pathWithinParent,
      registries
    })).toEqual(lockfileLintResults);
  });
});
