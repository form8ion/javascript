import any from '@travi/any';
import {it, expect, describe, vi, beforeEach} from 'vitest';
import {when} from 'vitest-when';

import {scaffold as scaffoldUnitTesting} from './unit/index.js';
import scaffoldTesting from './scaffolder.js';

vi.mock('./unit/index.js');

describe('testing scaffolder', () => {
  const projectRoot = any.string();
  const dialect = any.word();
  const unitTestingDevDependencies = any.listOf(any.string);
  const unitTestNextSteps = any.listOf(any.simpleObject);
  const unitTestScripts = any.simpleObject();
  const unitTestFilesToIgnoreFromVcs = any.listOf(any.string);
  const unitTestDirectoriesToIgnoreFromVcs = any.listOf(any.string);
  const unitTestFrameworks = any.simpleObject();
  const decisions = any.simpleObject();

  beforeEach(() => {
    when(scaffoldUnitTesting)
      .calledWith({projectRoot, frameworks: unitTestFrameworks, decisions, dialect})
      .thenResolve({
        dependencies: {javascript: {development: unitTestingDevDependencies}},
        scripts: unitTestScripts,
        vcsIgnore: {files: unitTestFilesToIgnoreFromVcs, directories: unitTestDirectoriesToIgnoreFromVcs},
        nextSteps: unitTestNextSteps
      });
  });

  it('should scaffold unit testing if the project will be unit test', async () => {
    expect(await scaffoldTesting({
      projectRoot,
      tests: {unit: true},
      unitTestFrameworks,
      decisions,
      dialect
    })).toEqual({
      dependencies: {javascript: {development: ['@travi/any', ...unitTestingDevDependencies]}},
      scripts: unitTestScripts,
      vcsIgnore: {files: unitTestFilesToIgnoreFromVcs, directories: unitTestDirectoriesToIgnoreFromVcs},
      eslint: {},
      nextSteps: unitTestNextSteps
    });
  });

  it('should not scaffold unit testing if the project will not be unit tested', async () => {
    expect(await scaffoldTesting({projectRoot, tests: {unit: false, integration: true}}))
      .toEqual({dependencies: {javascript: {development: ['@travi/any']}}, eslint: {}});
  });

  it('should not scaffold testing if the project will not be tested', async () => {
    expect(await scaffoldTesting({projectRoot, tests: {unit: false, integration: false}}))
      .toEqual({dependencies: {javascript: {development: []}}, eslint: {}});
  });
});
