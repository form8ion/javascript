import inquirer from 'inquirer';
import {prompt} from '@form8ion/overridable-prompts';
import {questionNames} from '../../../prompts/question-names';

const {Separator} = inquirer;

export default async function ({bundlers, decisions}) {
  if (!Object.keys(bundlers).length) return 'Other';

  const answers = await prompt([{
    name: questionNames.PACKAGE_BUNDLER,
    type: 'list',
    message: 'Which bundler should be used?',
    choices: [...Object.keys(bundlers), new Separator(), 'Other']
  }], decisions);

  return answers[questionNames.PACKAGE_BUNDLER];
}
