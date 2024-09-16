import * as prompts from '@form8ion/overridable-prompts';

import any from '@travi/any';
import {when} from 'jest-when';
import {describe, expect, it, vi} from 'vitest';

import {questionNames} from '../prompts/question-names.js';
import prompt from './prompt.js';

vi.mock('@form8ion/overridable-prompts');

describe('project-type prompts', () => {
  it('should present the choice of project-type', async () => {
    const chosenType = any.word();
    const projectType = any.word();
    const decisions = any.simpleObject();
    const answers = {...any.simpleObject(), [questionNames.PROJECT_TYPE_CHOICE]: chosenType};
    const types = any.simpleObject();
    when(prompts.prompt)
      .calledWith(
        [{
          name: questionNames.PROJECT_TYPE_CHOICE,
          type: 'list',
          message: `What type of ${projectType} is this?`,
          choices: [...Object.keys(types), 'Other']
        }],
        decisions
      )
      .mockResolvedValue(answers);

    expect(await prompt({types, projectType, decisions})).toEqual(chosenType);
  });

  it('should skip the prompt and return `Other` when no options are provided', async () => {
    expect(await prompt({types: {}, projectType: any.word()})).toEqual('Other');

    expect(prompts.prompt).not.toHaveBeenCalled();
  });
});
