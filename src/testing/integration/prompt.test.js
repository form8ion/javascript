import any from '@travi/any';
import {when} from 'vitest-when';
import {describe, expect, it, vi} from 'vitest';

import {questionNames} from '../../prompts/question-names.js';
import gatherIntegrationTestingInput, {INTEGRATION_TESTING_PROMPT_ID} from './prompt.js';

describe('integration-test framework prompt', () => {
  it('should preset the choice of integration-test framework', async () => {
    const {INTEGRATION_TEST_FRAMEWORK} = questionNames.INTEGRATION_TESTING;
    const chosenType = any.word();
    const answers = {...any.simpleObject(), [INTEGRATION_TEST_FRAMEWORK]: chosenType};
    const frameworks = any.simpleObject();
    const prompt = vi.fn();
    when(prompt)
      .calledWith({
        id: INTEGRATION_TESTING_PROMPT_ID,
        questions: [{
          name: INTEGRATION_TEST_FRAMEWORK,
          type: 'list',
          message: 'Which integration testing framework should be used?',
          choices: [...Object.keys(frameworks), 'Other']
        }]
      })
      .thenResolve(answers);

    expect(await gatherIntegrationTestingInput({frameworks, prompt})).toEqual(chosenType);
  });

  it('should skip the prompt and return `Other` when no options are provided', async () => {
    expect(await gatherIntegrationTestingInput({frameworks: {}, prompt: vi.fn()})).toEqual('Other');
  });
});
