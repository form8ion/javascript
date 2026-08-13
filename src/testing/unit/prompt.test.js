import any from '@travi/any';
import {when} from 'vitest-when';
import {describe, expect, it, vi} from 'vitest';

import {questionNames} from '../../prompts/question-names.js';
import gatherUnitTestingInput, {UNIT_TESTING_PROMPT_ID} from './prompt.js';

describe('unit-test framework prompts', () => {
  it('should preset the choice of unit-test framework', async () => {
    const {UNIT_TEST_FRAMEWORK} = questionNames.UNIT_TESTING;
    const chosenType = any.word();
    const answers = {...any.simpleObject(), [UNIT_TEST_FRAMEWORK]: chosenType};
    const frameworks = any.simpleObject();
    const prompt = vi.fn();
    when(prompt)
      .calledWith({
        id: UNIT_TESTING_PROMPT_ID,
        questions: [{
          name: UNIT_TEST_FRAMEWORK,
          type: 'list',
          message: 'Which unit testing framework should be used?',
          choices: [...Object.keys(frameworks), 'Other']
        }]
      })
      .thenResolve(answers);

    expect(await gatherUnitTestingInput({frameworks, prompt})).toEqual(chosenType);
  });

  it('should skip the prompt and return `Other` when no options are provided', async () => {
    expect(await gatherUnitTestingInput({frameworks: {}, prompt: vi.fn()})).toEqual('Other');
  });
});
