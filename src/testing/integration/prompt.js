import {prompt} from '@form8ion/overridable-prompts';
import {questionNames} from '../../prompts/question-names.js';

export const INTEGRATION_TESTING_PROMPT_ID = 'integration-testing';

export default async function gatherUnitTestingInput({frameworks, decisions}) {
  const {INTEGRATION_TEST_FRAMEWORK} = questionNames.INTEGRATION_TESTING;

  if (!Object.keys(frameworks).length) return 'Other';

  const answers = await prompt([{
    name: INTEGRATION_TEST_FRAMEWORK,
    type: 'list',
    message: 'Which integration testing framework should be used?',
    choices: [...Object.keys(frameworks), 'Other']
  }], decisions);

  return answers[INTEGRATION_TEST_FRAMEWORK];
}
