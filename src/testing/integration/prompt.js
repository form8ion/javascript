import {prompt} from '@form8ion/overridable-prompts';
import {questionNames} from '../../prompts/question-names.js';

export default async function gatherUnitTestingInput({frameworks, decisions}) {
  if (!Object.keys(frameworks).length) return 'Other';

  const answers = await prompt([{
    name: questionNames.INTEGRATION_TEST_FRAMEWORK,
    type: 'list',
    message: 'Which integration testing framework should be used?',
    choices: [...Object.keys(frameworks), 'Other']
  }], decisions);

  return answers[questionNames.INTEGRATION_TEST_FRAMEWORK];
}
