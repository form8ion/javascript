import deepmerge from 'deepmerge';
import {scaffold as scaffoldHusky} from '@form8ion/husky';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {scaffold as scaffoldTesting} from '../testing/index.js';
import {scaffold as scaffoldLinting} from '../linting/index.js';
import {scaffoldVerification} from './scaffolder.js';

vi.mock('deepmerge');
vi.mock('@form8ion/husky');
vi.mock('../testing/index.js');
vi.mock('../linting/index.js');

describe('verification scaffolder', () => {
  it('should scaffold linting and testing', async () => {
    const projectRoot = any.string();
    const packageManager = any.string();
    const dialect = any.word();
    const vcs = any.simpleObject();
    const tests = any.simpleObject();
    const unitTestFrameworks = any.simpleObject();
    const integrationTestFrameworks = any.simpleObject();
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
      .thenResolve(lintingResults);
    when(scaffoldTesting)
      .calledWith({projectRoot, tests, unitTestFrameworks, integrationTestFrameworks, decisions, dialect})
      .thenResolve(testingResults);
    when(scaffoldHusky).calledWith({projectRoot, packageManager, pathWithinParent}).thenResolve(huskyResults);
    when(deepmerge.all).calledWith([testingResults, lintingResults, huskyResults]).thenReturn(mergedResults);

    expect(await scaffoldVerification({
      projectRoot,
      vcs,
      dialect,
      tests,
      decisions,
      unitTestFrameworks,
      integrationTestFrameworks,
      packageManager,
      registries,
      pathWithinParent
    })).toEqual(mergedResults);
  });
});
