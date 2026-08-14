import {questionNames} from '../prompts/question-names.js';

export const PROJECT_TYPE_PLUGIN_PROMPT_ID = 'PROJECT_TYPE_PLUGIN';

export default async function gatherProjectTypePluginInput({types, projectType}, {prompt}) {
  const {PROJECT_TYPE_CHOICE} = questionNames[PROJECT_TYPE_PLUGIN_PROMPT_ID];

  if (!Object.keys(types).length) return 'Other';

  const answers = await prompt({
    id: PROJECT_TYPE_PLUGIN_PROMPT_ID,
    questions: [{
      name: PROJECT_TYPE_CHOICE,
      type: 'list',
      message: `What type of ${projectType} is this?`,
      choices: [...Object.keys(types), 'Other']
    }]
  });

  return answers[PROJECT_TYPE_CHOICE];
}
