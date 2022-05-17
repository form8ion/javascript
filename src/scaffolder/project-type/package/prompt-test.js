import inquirer from 'inquirer';
import * as prompts from '@form8ion/overridable-prompts';
import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import {questionNames} from '../../../prompts/question-names';
import prompt from './prompt';

suite('bundler prompt', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(prompts, 'prompt');
  });

  teardown(() => sandbox.restore());

  test('that the choice of package bundlers is presented', async () => {
    const chosenType = any.word();
    const decisions = any.simpleObject();
    const answers = {...any.simpleObject(), [questionNames.PACKAGE_BUNDLER]: chosenType};
    const bundlers = any.simpleObject();
    prompts.prompt
      .withArgs([{
        name: questionNames.PACKAGE_BUNDLER,
        type: 'list',
        message: 'Which bundler should be used?',
        choices: [...Object.keys(bundlers), new inquirer.Separator(), 'Other']
      }], decisions)
      .resolves(answers);

    assert.equal(await prompt({bundlers, decisions}), chosenType);
  });

  test('that the prompt is skipped and `Other` is returned when no options ar provided ', async () => {
    assert.equal(await prompt({bundlers: {}}), 'Other');
  });
});
