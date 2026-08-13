import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {questionNames} from '../../../prompts/question-names.js';
import gatherBundlerInput, {PACKAGE_BUNDLER_PROMPT_ID} from './prompt.js';

vi.mock('@form8ion/overridable-prompts');

describe('bundler prompt', () => {
  it('should present the choice of package bundlers', async () => {
    const {PACKAGE_BUNDLER} = questionNames.PACKAGE_BUNDLER;
    const chosenType = any.word();
    const answers = {...any.simpleObject(), [PACKAGE_BUNDLER]: chosenType};
    const bundlers = any.simpleObject();
    const prompt = vi.fn();
    when(prompt).calledWith({
      id: PACKAGE_BUNDLER_PROMPT_ID,
      questions: [{
        name: PACKAGE_BUNDLER,
        type: 'list',
        message: 'Which bundler should be used?',
        choices: [...Object.keys(bundlers), 'Other']
      }]
    }).thenResolve(answers);

    expect(await gatherBundlerInput({bundlers}, {prompt})).toEqual(chosenType);
  });

  it('should skip the prompt and return `Other` when no options are provided', async () => {
    const prompt = vi.fn();

    expect(await gatherBundlerInput({bundlers: {}}, {prompt})).toEqual('Other');
  });
});
