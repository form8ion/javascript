import {prompt} from '@form8ion/overridable-prompts';

import {questionNames} from '../prompts/question-names.js';

export const PROJECT_TYPE_PLUGIN_PROMPT_ID = 'project-type-plugin';

export default async function gatherProjectTypePluginInput({types, projectType, decisions}) {
  const {PROJECT_TYPE_CHOICE} = questionNames.PROJECT_TYPE_PLUGIN;

  if (!Object.keys(types).length) return 'Other';

  const answers = await prompt([{
    name: PROJECT_TYPE_CHOICE,
    type: 'list',
    message: `What type of ${projectType} is this?`,
    choices: [...Object.keys(types), 'Other']
  }], decisions);

  return answers[PROJECT_TYPE_CHOICE];
}
