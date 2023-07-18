import {validateOptions} from '@form8ion/core';
import {scaffoldChoice} from '@form8ion/javascript-core';
import deepmerge from 'deepmerge';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import scaffoldCoverage from '../coverage/scaffolder';
import prompt from './prompt';
import scaffoldUnitTesting from './unit';
import {unitTestFrameworksSchema} from './options-schemas';

vi.mock('deepmerge');
vi.mock('@form8ion/core');
vi.mock('@form8ion/javascript-core');
vi.mock('../coverage/scaffolder');
vi.mock('./prompt');

describe('unit testing scaffolder', () => {
  const projectRoot = any.string();
  const vcs = any.simpleObject();
  const frameworks = any.simpleObject();
  const decisions = any.simpleObject();
  const chosenFramework = any.word();
  const dialect = any.word();
  const pathWithinParent = any.string();
  const coverageResults = any.simpleObject();
  const unitTestFrameworkResults = any.simpleObject();
  const mergedResults = any.simpleObject();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the chosen framework', async () => {
    const visibility = any.word();
    const validatedFrameworks = any.simpleObject();
    when(validateOptions).calledWith(unitTestFrameworksSchema, frameworks).mockReturnValue(validatedFrameworks);
    when(prompt).calledWith({frameworks: validatedFrameworks, decisions}).mockResolvedValue(chosenFramework);
    when(scaffoldChoice)
      .calledWith(validatedFrameworks, chosenFramework, {projectRoot, dialect})
      .mockResolvedValue(unitTestFrameworkResults);
    when(scaffoldCoverage)
      .calledWith({projectRoot, vcs, visibility, pathWithinParent})
      .mockResolvedValue(coverageResults);
    when(deepmerge.all)
      .calledWith([
        {scripts: {'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base'}},
        unitTestFrameworkResults,
        coverageResults
      ])
      .mockReturnValue(mergedResults);

    expect(await scaffoldUnitTesting({projectRoot, frameworks, decisions, vcs, visibility, pathWithinParent, dialect}))
      .toEqual(mergedResults);
  });
});
