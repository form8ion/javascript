import {scaffoldChoice as scaffoldChosenBundler} from '@form8ion/javascript-core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import chooseBundler from './prompt.js';
import scaffoldBundler from './scaffolder.js';

vi.mock('@form8ion/javascript-core');
vi.mock('./prompt');

describe('package bundler scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should enable choosing from the available bundlers and scaffold the chosen one', async () => {
    const projectRoot = any.string();
    const dialect = any.word();
    const projectType = any.word();
    const bundlers = any.simpleObject();
    const decisions = any.simpleObject();
    const bundlerResults = any.simpleObject();
    const chosenBundler = any.word();
    when(chooseBundler).calledWith({bundlers, decisions}).thenResolve(chosenBundler);
    when(scaffoldChosenBundler)
      .calledWith(bundlers, chosenBundler, {projectRoot, dialect, projectType})
      .thenResolve(bundlerResults);

    expect(await scaffoldBundler({bundlers, projectRoot, projectType, dialect, decisions})).toEqual(bundlerResults);
  });
});
