import {questionNames} from '../../prompts/question-names.js';

export const UNIT_TESTING_PROMPT_ID = 'unit-testing';

export default async function gatherUnitTestingInput({frameworks, prompt}) {
  const {UNIT_TEST_FRAMEWORK} = questionNames.UNIT_TESTING;

  if (!Object.keys(frameworks).length) return 'Other';

  const answers = await prompt({
    id: UNIT_TESTING_PROMPT_ID,
    questions: [{
      name: UNIT_TEST_FRAMEWORK,
      type: 'list',
      message: 'Which unit testing framework should be used?',
      choices: [...Object.keys(frameworks), 'Other']
    }]
  });

  return answers[UNIT_TEST_FRAMEWORK];
}
