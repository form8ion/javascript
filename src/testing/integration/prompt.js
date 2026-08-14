import {questionNames} from '../../prompts/question-names.js';

export const INTEGRATION_TESTING_PROMPT_ID = 'INTEGRATION_TESTING';

export default async function gatherIntegrationTestingInput({frameworks, prompt}) {
  const {INTEGRATION_TEST_FRAMEWORK} = questionNames[INTEGRATION_TESTING_PROMPT_ID];

  if (!Object.keys(frameworks).length) return 'Other';

  const answers = await prompt({
    id: INTEGRATION_TESTING_PROMPT_ID,
    questions: [{
      name: INTEGRATION_TEST_FRAMEWORK,
      type: 'list',
      message: 'Which integration testing framework should be used?',
      choices: [...Object.keys(frameworks), 'Other']
    }]
  });

  return answers[INTEGRATION_TEST_FRAMEWORK];
}
