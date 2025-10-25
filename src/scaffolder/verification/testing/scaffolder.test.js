import any from '@travi/any';
import {it, expect, describe, vi, beforeEach} from 'vitest';
import {when} from 'vitest-when';

import scaffoldUnitTesting from '../../../testing/unit.js';
import scaffoldTesting from './scaffolder.js';

vi.mock('../../../testing/unit.js');

describe('testing scaffolder', () => {
  const projectRoot = any.string();
  const visibility = any.word();
  const dialect = any.word();
  const unitTestingDevDependencies = any.listOf(any.string);
  const unitTestNextSteps = any.listOf(any.simpleObject);
  const unitTestScripts = any.simpleObject();
  const unitTestFilesToIgnoreFromVcs = any.listOf(any.string);
  const unitTestDirectoriesToIgnoreFromVcs = any.listOf(any.string);
  const vcs = any.simpleObject();
  const unitTestFrameworks = any.simpleObject();
  const decisions = any.simpleObject();
  const pathWithinParent = any.string();

  beforeEach(() => {
    when(scaffoldUnitTesting)
      .calledWith({projectRoot, visibility, vcs, frameworks: unitTestFrameworks, decisions, dialect, pathWithinParent})
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
      visibility,
      tests: {unit: true},
      vcs,
      unitTestFrameworks,
      decisions,
      dialect,
      pathWithinParent
    })).toEqual({
      dependencies: {javascript: {development: ['@travi/any', ...unitTestingDevDependencies]}},
      scripts: unitTestScripts,
      vcsIgnore: {files: unitTestFilesToIgnoreFromVcs, directories: unitTestDirectoriesToIgnoreFromVcs},
      eslint: {},
      nextSteps: unitTestNextSteps
    });
  });

  it('should not scaffold unit testing if the project will not be unit tested', async () => {
    expect(await scaffoldTesting({projectRoot, visibility, tests: {unit: false, integration: true}, pathWithinParent}))
      .toEqual({dependencies: {javascript: {development: ['@travi/any']}}, eslint: {}});
  });

  it('should not scaffold testing if the project will not be tested', async () => {
    expect(await scaffoldTesting({projectRoot, visibility, tests: {unit: false, integration: false}, pathWithinParent}))
      .toEqual({dependencies: {javascript: {development: []}}, eslint: {}});
  });
});
