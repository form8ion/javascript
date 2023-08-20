import {scaffold as scaffoldPrettier} from '@form8ion/prettier';
import {scaffold as scaffoldEslint} from '@form8ion/eslint';
import deepmerge from 'deepmerge';

import {describe, vi, it, expect, afterEach, beforeEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as scaffoldRemark} from './remark';
import {scaffold} from '.';

vi.mock('@form8ion/prettier');
vi.mock('@form8ion/eslint');
vi.mock('deepmerge');
vi.mock('./remark');

describe('code-style scaffolder', () => {
  const pathWithinParent = any.string();
  const projectRoot = any.string();
  const projectType = any.word();
  const configForEslint = any.simpleObject();
  const configForPrettier = any.simpleObject();
  const vcs = any.simpleObject();
  const configForRemark = any.simpleObject();
  const configureLinting = true;
  const remarkResults = any.simpleObject();
  const eslintResults = any.simpleObject();
  const prettierResults = any.simpleObject();
  const mergedResults = any.simpleObject();

  beforeEach(() => {
    when(scaffoldEslint).calledWith({projectRoot, config: configForEslint}).mockResolvedValue(eslintResults);
    when(scaffoldRemark)
      .calledWith({projectRoot, projectType, config: configForRemark, vcs})
      .mockResolvedValue(remarkResults);
    when(scaffoldPrettier).calledWith({projectRoot, config: configForPrettier}).mockResolvedValue(prettierResults);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should configure linters when config definitions are provided', async () => {
    when(deepmerge.all).calledWith([eslintResults, remarkResults, prettierResults]).mockReturnValue(mergedResults);

    const result = await scaffold({
      projectRoot,
      projectType,
      configs: {eslint: configForEslint, remark: configForRemark, prettier: configForPrettier},
      vcs,
      configureLinting,
      pathWithinParent
    });

    expect(result).toEqual(mergedResults);
  });

  it('should not scaffold eslint when a config is not provided', async () => {
    when(deepmerge.all).calledWith([remarkResults, prettierResults]).mockReturnValue(mergedResults);

    const result = await scaffold({
      projectRoot,
      projectType,
      configs: {remark: configForRemark, prettier: configForPrettier},
      vcs,
      configureLinting,
      pathWithinParent
    });

    expect(result).toEqual(mergedResults);
  });

  it('should not scaffold eslint when `transpileLint` is false', async () => {
    when(deepmerge.all).calledWith([remarkResults, prettierResults]).mockReturnValue(mergedResults);

    const result = await scaffold({
      projectRoot,
      projectType,
      configs: {eslint: configForEslint, remark: configForRemark, prettier: configForPrettier},
      vcs,
      configureLinting: false,
      pathWithinParent
    });

    expect(result).toEqual(mergedResults);
  });
});
