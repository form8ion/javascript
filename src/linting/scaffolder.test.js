import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import scaffoldBanSensitiveFiles from './ban-sensitive-files';
import {scaffold as scaffoldLockfileLint} from '../lockfile-lint';
import {scaffold} from './index';

vi.mock('./ban-sensitive-files');
vi.mock('../lockfile-lint');

describe('linting scaffolder', () => {
  const pathWithinParent = any.string();
  const banSensitiveFilesDevDependencies = any.listOf(any.string);
  const banSensitiveFilesScripts = any.simpleObject();
  const lockfileDevDependencies = any.listOf(any.string);
  const lockfileScripts = any.simpleObject();
  const projectRoot = any.string();
  const packageManager = any.word();
  const vcs = any.simpleObject();
  const registries = any.simpleObject();

  beforeEach(() => {
    when(scaffoldBanSensitiveFiles)
      .calledWith({pathWithinParent})
      .mockResolvedValue({devDependencies: banSensitiveFilesDevDependencies, scripts: banSensitiveFilesScripts});
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

    expect(devDependencies).toEqual([...lockfileDevDependencies, ...banSensitiveFilesDevDependencies]);
    expect(scripts).toEqual({...lockfileScripts, ...banSensitiveFilesScripts});
  });

  it('should not scaffold ban-sensitive-files when the project will not be versioned', async () => {
    const {devDependencies, scripts} = await scaffold({projectRoot, vcs: undefined, packageManager, registries});

    expect(devDependencies).toEqual(lockfileDevDependencies);
    expect(scripts).toEqual(lockfileScripts);
  });
});
