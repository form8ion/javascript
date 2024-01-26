import {prompt} from '@form8ion/overridable-prompts';

import {questionNames} from '../../../prompts/question-names.js';

export default async function ({bundlers, decisions}) {
  if (!Object.keys(bundlers).length) return 'Other';

  const answers = await prompt([{
    name: questionNames.PACKAGE_BUNDLER,
    type: 'list',
    message: 'Which bundler should be used?',
    choices: [...Object.keys(bundlers), 'Other']
  }], decisions);

  return answers[questionNames.PACKAGE_BUNDLER];
}
