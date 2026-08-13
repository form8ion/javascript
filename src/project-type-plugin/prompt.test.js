import any from '@travi/any';
import {when} from 'vitest-when';
import {describe, expect, it, vi} from 'vitest';

import {questionNames} from '../prompts/question-names.js';
import gatherProjectTypePluginInput, {PROJECT_TYPE_PLUGIN_PROMPT_ID} from './prompt.js';

describe('project-type prompts', () => {
  it('should present the choice of project-type', async () => {
    const {PROJECT_TYPE_CHOICE} = questionNames.PROJECT_TYPE_PLUGIN;
    const chosenType = any.word();
    const projectType = any.word();
    const decisions = any.simpleObject();
    const answers = {...any.simpleObject(), [PROJECT_TYPE_CHOICE]: chosenType};
    const types = any.simpleObject();
    const prompt = vi.fn();
    when(prompt)
      .calledWith({
        id: PROJECT_TYPE_PLUGIN_PROMPT_ID,
        questions: [{
          name: PROJECT_TYPE_CHOICE,
          type: 'list',
          message: `What type of ${projectType} is this?`,
          choices: [...Object.keys(types), 'Other']
        }]
      })
      .thenResolve(answers);

    expect(await gatherProjectTypePluginInput({types, projectType, decisions}, {prompt})).toEqual(chosenType);
  });

  it('should skip the prompt and return `Other` when no options are provided', async () => {
    const prompt = vi.fn();

    expect(await gatherProjectTypePluginInput({types: {}, projectType: any.word()}, {prompt})).toEqual('Other');

    expect(prompt).not.toHaveBeenCalled();
  });
});
