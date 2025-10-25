import * as prompts from '@form8ion/overridable-prompts';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {questionNames} from '../../../prompts/question-names.js';
import prompt from './prompt.js';

vi.mock('@form8ion/overridable-prompts');

describe('bundler prompt', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should present the choice of package bundlers', async () => {
    const chosenType = any.word();
    const decisions = any.simpleObject();
    const answers = {...any.simpleObject(), [questionNames.PACKAGE_BUNDLER]: chosenType};
    const bundlers = any.simpleObject();
    when(prompts.prompt).calledWith([{
      name: questionNames.PACKAGE_BUNDLER,
      type: 'list',
      message: 'Which bundler should be used?',
      choices: [...Object.keys(bundlers), 'Other']
    }], decisions).thenResolve(answers);

    expect(await prompt({bundlers, decisions})).toEqual(chosenType);
  });

  it('should skip the prompt and return `Other` when no options are provided', async () => {
    expect(await prompt({bundlers: {}})).toEqual('Other');
  });
});
