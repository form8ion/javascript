import {prompt} from '@form8ion/overridable-prompts';

import {questionNames} from '../../../prompts/question-names.js';

export const PACKAGE_BUNDLER_PROMPT_ID = 'package-bundler';

export default async function gatherBundlerInput({bundlers, decisions}) {
  const {PACKAGE_BUNDLER} = questionNames.PACKAGE_BUNDLER;

  if (!Object.keys(bundlers).length) return 'Other';

  const answers = await prompt([{
    name: PACKAGE_BUNDLER,
    type: 'list',
    message: 'Which bundler should be used?',
    choices: [...Object.keys(bundlers), 'Other']
  }], decisions);

  return answers[PACKAGE_BUNDLER];
}
