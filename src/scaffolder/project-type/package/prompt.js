import {Separator} from 'inquirer';
import {prompt} from '@form8ion/overridable-prompts';
import {questionNames} from '../../../prompts/question-names';

export default async function ({frameworks, decisions}) {
  if (!Object.keys(frameworks).length) return 'Other';

  const answers = await prompt([{
    name: questionNames.PACKAGE_BUNDLER,
    type: 'list',
    message: 'Which bundler should be used?',
    choices: [...Object.keys(frameworks), new Separator(), 'Other']
  }], decisions);

  return answers[questionNames.PACKAGE_BUNDLER];
}
