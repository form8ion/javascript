import commonPrompts from '@travi/language-scaffolder-prompts';
import * as prompts from '@form8ion/overridable-prompts';
import {packageManagers, projectTypes} from '@form8ion/javascript-core';

import {expect, describe, it, vi, beforeEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import execa from '../../thirdparty-wrappers/execa.js';
import npmConfFactory from '../../thirdparty-wrappers/npm-conf.js';
import buildDialectChoices from '../dialects/prompt-choices.js';
import {questionNames} from './question-names.js';
import * as conditionals from './conditionals.js';
import {prompt} from './questions.js';
import * as validators from './validators.js';

vi.mock('@travi/language-scaffolder-prompts');
vi.mock('@form8ion/overridable-prompts');
vi.mock('../../thirdparty-wrappers/execa.js');
vi.mock('../../thirdparty-wrappers/npm-conf.js');
vi.mock('../dialects/prompt-choices.js');
vi.mock('./validators.js');
vi.mock('./conditionals.js');

describe('prompts', () => {
  const commonQuestions = any.listOf(any.simpleObject);
  const decisions = any.simpleObject();
  const vcs = any.simpleObject();
  const pathWithinParent = any.string();
  const ciServices = any.simpleObject();
  const visibility = any.word();
  const integrationTested = any.boolean();
  const unitTested = any.boolean();
  const tests = {unit: unitTested, integration: integrationTested};
  const authorName = any.string();
  const authorEmail = any.string();
  const authorUrl = any.url();
  const author = {name: authorName, email: authorEmail, url: authorUrl};
  const chosenHost = any.word();
  const dialect = any.word();
  const ci = any.word();
  const nodeVersionCategory = any.word();
  const packageManager = any.word();
  const projectType = any.word();
  const scope = any.word();
  const provideExample = any.boolean();
  const answers = {
    [commonPrompts.questionNames.UNIT_TESTS]: unitTested,
    [commonPrompts.questionNames.INTEGRATION_TESTS]: integrationTested,
    [questionNames.PROJECT_TYPE]: projectType,
    [commonPrompts.questionNames.CI_SERVICE]: ci,
    [questionNames.HOST]: chosenHost,
    [questionNames.SCOPE]: scope,
    [questionNames.NODE_VERSION_CATEGORY]: nodeVersionCategory,
    [questionNames.AUTHOR_NAME]: authorName,
    [questionNames.AUTHOR_EMAIL]: authorEmail,
    [questionNames.AUTHOR_URL]: authorUrl,
    [questionNames.PACKAGE_MANAGER]: packageManager,
    [questionNames.DIALECT]: dialect,
    [questionNames.PROVIDE_EXAMPLE]: provideExample
  };

  beforeEach(() => {
    when(commonPrompts.questions)
      .calledWith({vcs, ciServices, pathWithinParent: undefined})
      .mockReturnValue(commonQuestions);
  });

  it('should prompt the user for the necessary details', async () => {
    const npmUser = any.word();
    const get = vi.fn();
    const hosts = any.simpleObject();
    const dialects = any.listOf(any.simpleObject);
    const configs = any.simpleObject();
    const scopeValidator = () => undefined;
    const scopePromptShouldBePresented = () => undefined;
    npmConfFactory.mockReturnValue({get});
    when(get).calledWith('init.author.name').mockReturnValue(authorName);
    when(get).calledWith('init.author.email').mockReturnValue(authorEmail);
    when(get).calledWith('init.author.url').mockReturnValue(authorUrl);
    when(execa).calledWith('npm', ['whoami']).mockResolvedValue({stdout: npmUser});
    when(validators.scope).calledWith(visibility).mockReturnValue(scopeValidator);
    when(conditionals.scopePromptShouldBePresentedFactory)
      .calledWith(visibility)
      .mockReturnValue(scopePromptShouldBePresented);
    when(buildDialectChoices).calledWith(configs).mockReturnValue(dialects);
    when(prompts.prompt)
      .calledWith([
        {
          name: questionNames.DIALECT,
          message: 'Which JavaScript dialect should this project follow?',
          type: 'list',
          choices: dialects,
          default: 'babel'
        },
        {
          name: questionNames.NODE_VERSION_CATEGORY,
          message: 'What node.js version should be used?',
          type: 'list',
          choices: ['LTS', 'Latest'],
          default: 'LTS'
        },
        {
          name: questionNames.PACKAGE_MANAGER,
          message: 'Which package manager will be used with this project?',
          type: 'list',
          choices: Object.values(packageManagers),
          default: packageManagers.NPM
        },
        {
          name: questionNames.PROJECT_TYPE,
          message: 'What type of JavaScript project is this?',
          type: 'list',
          choices: [...Object.values(projectTypes), 'Other'],
          default: projectTypes.PACKAGE
        },
        {
          name: questionNames.SHOULD_BE_SCOPED,
          message: 'Should this package be scoped?',
          type: 'confirm',
          when: conditionals.shouldBeScopedPromptShouldBePresented,
          default: true
        },
        {
          name: questionNames.SCOPE,
          message: 'What is the scope?',
          when: scopePromptShouldBePresented,
          validate: scopeValidator,
          default: npmUser
        },
        {
          name: questionNames.AUTHOR_NAME,
          message: 'What is the author\'s name?',
          default: authorName
        },
        {
          name: questionNames.AUTHOR_EMAIL,
          message: 'What is the author\'s email?',
          default: authorEmail
        },
        {
          name: questionNames.AUTHOR_URL,
          message: 'What is the author\'s website url?',
          default: authorUrl
        },
        ...commonQuestions,
        {
          name: questionNames.CONFIGURE_LINTING,
          message: 'Will there be source code that should be linted?',
          type: 'confirm',
          when: conditionals.lintingPromptShouldBePresented
        },
        {
          name: questionNames.PROVIDE_EXAMPLE,
          message: 'Should an example be provided in the README?',
          type: 'confirm',
          when: conditionals.projectIsPackage
        },
        {
          name: questionNames.HOST,
          type: 'list',
          message: 'Where will the application be hosted?',
          when: conditionals.projectIsApplication,
          choices: [...Object.keys(hosts), 'Other']
        }
      ], decisions)
      .mockResolvedValue({...answers, [questionNames.CONFIGURE_LINTING]: any.word()});

    expect(await prompt(ciServices, hosts, visibility, vcs, decisions, configs)).toEqual({
      tests,
      projectType,
      ci,
      chosenHost,
      scope,
      nodeVersionCategory,
      author,
      packageManager,
      dialect,
      configureLinting: true,
      provideExample
    });
  });

  it('should not override the transpile/lint value when set to `false`', async () => {
    const npmUser = any.word();
    const get = vi.fn();
    npmConfFactory.mockReturnValue({get});
    when(execa).calledWith('npm', ['whoami']).mockResolvedValue({stdout: npmUser});
    prompts.prompt.mockResolvedValue({...answers, [questionNames.CONFIGURE_LINTING]: false});

    expect(await prompt(ciServices, {}, visibility, vcs, decisions)).toEqual({
      tests,
      projectType,
      ci,
      chosenHost,
      scope,
      nodeVersionCategory,
      author,
      packageManager,
      provideExample,
      dialect,
      configureLinting: false
    });
  });

  it('should not ask about node version for sub-projects since the parent project already defines', async () => {
    when(execa).calledWith('npm', ['whoami']).mockResolvedValue({stdout: any.word()});
    npmConfFactory.mockReturnValue({get: () => undefined});
    when(commonPrompts.questions)
      .calledWith({vcs, ciServices, pathWithinParent})
      .mockReturnValue(commonQuestions);
    prompts.prompt.mockResolvedValue(answers);

    await prompt(ciServices, {}, 'Private', vcs, null, null, pathWithinParent);

    const [questions] = prompts.prompt.mock.lastCall;
    expect(questions.filter(question => questionNames.NODE_VERSION_CATEGORY === question.name).length).toEqual(0);
  });

  it('should not ask whether private packages should be scoped', async () => {
    when(execa).calledWith('npm', ['whoami']).mockResolvedValue({stdout: any.word()});
    npmConfFactory.mockReturnValue({get: () => undefined});
    when(commonPrompts.questions)
      .calledWith({vcs, ciServices, pathWithinParent})
      .mockReturnValue(commonQuestions);
    prompts.prompt.mockResolvedValue(answers);

    await prompt(ciServices, {}, 'Private', vcs, null, null, pathWithinParent);

    const [questions] = prompts.prompt.mock.lastCall;
    expect(questions.filter(question => questionNames.SHOULD_BE_SCOPED === question.name).length).toEqual(0);
  });

  it('should handle a non-logged-in user gracefully', async () => {
    when(execa).calledWith('npm', ['whoami']).mockRejectedValue(new Error());
    npmConfFactory.mockReturnValue({get: () => undefined});
    when(commonPrompts.questions)
      .calledWith({vcs, ciServices, pathWithinParent})
      .mockReturnValue(commonQuestions);
    prompts.prompt.mockResolvedValue(answers);

    await prompt(ciServices, {}, 'Public', vcs, {}, null, pathWithinParent);

    const [questions] = prompts.prompt.mock.lastCall;
    expect(questions.filter(question => questionNames.SHOULD_BE_SCOPED === question.name).length).toEqual(1);
  });
});
