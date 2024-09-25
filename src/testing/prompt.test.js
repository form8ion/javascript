import * as prompts from '@form8ion/overridable-prompts';

import any from '@travi/any';
import {when} from 'jest-when';
import {describe, expect, it, vi} from 'vitest';

import {questionNames} from '../prompts/question-names.js';
import prompt from './prompt.js';

vi.mock('@form8ion/overridable-prompts');

describe('project-type prompts', () => {
  it('should preset the choice of application-type', async () => {
    const chosenType = any.word();
    const decisions = any.simpleObject();
    const answers = {...any.simpleObject(), [questionNames.UNIT_TEST_FRAMEWORK]: chosenType};
    const frameworks = any.simpleObject();
    when(prompts.prompt)
      .calledWith([{
        name: questionNames.UNIT_TEST_FRAMEWORK,
        type: 'list',
        message: 'Which type of unit testing framework should be used?',
        choices: [...Object.keys(frameworks), 'Other']
      }], decisions)
      .mockResolvedValue(answers);

    expect(await prompt({frameworks, decisions})).toEqual(chosenType);
  });

  it('should skip the prompt and return `Other` when no options are provided', async () => {
    expect(await prompt({frameworks: {}})).toEqual('Other');
  });
});
