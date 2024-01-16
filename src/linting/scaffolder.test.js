import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as scaffoldLockfileLint} from '../lockfile-lint/index.js';
import {scaffold} from './index.js';

vi.mock('../lockfile-lint');

describe('linting scaffolder', () => {
  const pathWithinParent = any.string();
  const lockfileDevDependencies = any.listOf(any.string);
  const lockfileScripts = any.simpleObject();
  const projectRoot = any.string();
  const packageManager = any.word();
  const vcs = any.simpleObject();
  const registries = any.simpleObject();

  beforeEach(() => {
    when(scaffoldLockfileLint)
      .calledWith({projectRoot, packageManager, registries})
      .mockResolvedValue({devDependencies: lockfileDevDependencies, scripts: lockfileScripts});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should configure linters when config definitions are provided', async () => {
    const {devDependencies, scripts} = await scaffold({
      projectRoot,
      vcs,
      packageManager,
      pathWithinParent,
      registries
    });

    expect(devDependencies).toEqual(lockfileDevDependencies);
    expect(scripts).toEqual(lockfileScripts);
  });
});
