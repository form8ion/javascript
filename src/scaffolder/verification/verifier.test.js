import deepmerge from 'deepmerge';
import {scaffold as scaffoldHusky} from '@form8ion/husky';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as testingScaffolder from './testing/scaffolder.js';
import {scaffold as scaffoldLinting} from '../../linting/index.js';
import {scaffoldVerification} from './verifier.js';

vi.mock('deepmerge');
vi.mock('@form8ion/husky');
vi.mock('./testing/scaffolder');
vi.mock('../../linting');

describe('verification', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold linting and testing', async () => {
    const projectRoot = any.string();
    const visibility = any.string();
    const packageManager = any.string();
    const dialect = any.word();
    const vcs = any.simpleObject();
    const tests = any.simpleObject();
    const unitTestFrameworks = any.simpleObject();
    const decisions = any.simpleObject();
    const lintingResults = any.simpleObject();
    const huskyResults = any.simpleObject();
    const testingEslintResults = any.simpleObject();
    const pathWithinParent = any.string();
    const testingResults = {...any.simpleObject(), eslint: testingEslintResults};
    const registries = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(scaffoldLinting)
      .calledWith({projectRoot, vcs, packageManager, registries, pathWithinParent})
      .mockResolvedValue(lintingResults);
    when(testingScaffolder.default)
      .calledWith({projectRoot, tests, visibility, vcs, unitTestFrameworks, decisions, dialect, pathWithinParent})
      .mockResolvedValue(testingResults);
    when(scaffoldHusky).calledWith({projectRoot, packageManager, pathWithinParent}).mockResolvedValue(huskyResults);
    when(deepmerge.all).calledWith([testingResults, lintingResults, huskyResults]).mockReturnValue(mergedResults);

    expect(await scaffoldVerification({
      projectRoot,
      vcs,
      dialect,
      tests,
      visibility,
      decisions,
      unitTestFrameworks,
      packageManager,
      registries,
      pathWithinParent
    })).toEqual(mergedResults);
  });
});
