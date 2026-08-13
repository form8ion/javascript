import {questionNames} from '../../../prompts/question-names.js';

export const PACKAGE_BUNDLER_PROMPT_ID = 'package-bundler';

export default async function gatherBundlerInput({bundlers}, {prompt}) {
  const {PACKAGE_BUNDLER} = questionNames.PACKAGE_BUNDLER;

  if (!Object.keys(bundlers).length) return 'Other';

  const answers = await prompt({
    id: PACKAGE_BUNDLER_PROMPT_ID,
    questions: [{
      name: PACKAGE_BUNDLER,
      type: 'list',
      message: 'Which bundler should be used?',
      choices: [...Object.keys(bundlers), 'Other']
    }]
  });

  return answers[PACKAGE_BUNDLER];
}
