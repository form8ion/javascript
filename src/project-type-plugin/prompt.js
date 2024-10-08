import {prompt} from '@form8ion/overridable-prompts';

import {questionNames} from '../prompts/question-names.js';

export default async function ({types, projectType, decisions}) {
  if (!Object.keys(types).length) return 'Other';

  const answers = await prompt([{
    name: questionNames.PROJECT_TYPE_CHOICE,
    type: 'list',
    message: `What type of ${projectType} is this?`,
    choices: [...Object.keys(types), 'Other']
  }], decisions);

  return answers[questionNames.PROJECT_TYPE_CHOICE];
}
