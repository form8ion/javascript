import {execa} from 'execa';
import {packageManagers, projectTypes} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import npmConfFactory from '../../thirdparty-wrappers/npm-conf.js';
import buildDialectChoices from '../dialects/prompt-choices.js';
import {questionNames} from './question-names.js';
import * as conditionals from './conditionals.js';
import {gatherBaseDetailsInput, JAVASCRIPT_BASE_DETAILS_PROMPT_ID} from './questions.js';
import * as validators from './validators.js';

const {JAVASCRIPT_BASE_DETAILS} = questionNames;

vi.mock('execa');
vi.mock('../../thirdparty-wrappers/npm-conf.js');
vi.mock('../dialects/prompt-choices.js');
vi.mock('./validators.js');
vi.mock('./conditionals.js');

describe('prompts', () => {
  const vcs = any.simpleObject();
  const pathWithinParent = any.string();
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
    [JAVASCRIPT_BASE_DETAILS.UNIT_TESTS]: unitTested,
    [JAVASCRIPT_BASE_DETAILS.INTEGRATION_TESTS]: integrationTested,
    [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectType,
    [ci]: ci,
    [JAVASCRIPT_BASE_DETAILS.HOST]: chosenHost,
    [JAVASCRIPT_BASE_DETAILS.SCOPE]: scope,
    [JAVASCRIPT_BASE_DETAILS.NODE_VERSION_CATEGORY]: nodeVersionCategory,
    [JAVASCRIPT_BASE_DETAILS.AUTHOR_NAME]: authorName,
    [JAVASCRIPT_BASE_DETAILS.AUTHOR_EMAIL]: authorEmail,
    [JAVASCRIPT_BASE_DETAILS.AUTHOR_URL]: authorUrl,
    [JAVASCRIPT_BASE_DETAILS.PACKAGE_MANAGER]: packageManager,
    [JAVASCRIPT_BASE_DETAILS.DIALECT]: dialect,
    [JAVASCRIPT_BASE_DETAILS.PROVIDE_EXAMPLE]: provideExample
  };
  const logger = {info: () => undefined, warn: () => undefined};

  it('should prompt the user for the necessary details', async () => {
    const prompt = vi.fn();
    const npmUser = any.word();
    const get = vi.fn();
    const hosts = any.simpleObject();
    const dialects = any.listOf(any.simpleObject);
    const configs = any.simpleObject();
    const scopeValidator = () => undefined;
    const scopePromptShouldBePresented = () => undefined;
    when(npmConfFactory).calledWith().thenReturn({get});
    when(get).calledWith('init.author.name').thenReturn(authorName);
    when(get).calledWith('init.author.email').thenReturn(authorEmail);
    when(get).calledWith('init.author.url').thenReturn(authorUrl);
    when(execa).calledWith('npm', ['whoami']).thenResolve({stdout: npmUser});
    when(validators.scope).calledWith(visibility).thenReturn(scopeValidator);
    when(conditionals.scopePromptShouldBePresentedFactory)
      .calledWith(visibility)
      .thenReturn(scopePromptShouldBePresented);
    when(buildDialectChoices).calledWith(configs).thenReturn(dialects);
    when(prompt)
      .calledWith({
        id: JAVASCRIPT_BASE_DETAILS_PROMPT_ID,
        questions: [
          {
            name: JAVASCRIPT_BASE_DETAILS.DIALECT,
            message: 'Which JavaScript dialect should this project follow?',
            type: 'list',
            choices: dialects,
            default: 'babel'
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.NODE_VERSION_CATEGORY,
            message: 'What node.js version should be used?',
            type: 'list',
            choices: ['LTS', 'Latest'],
            default: 'LTS'
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.PACKAGE_MANAGER,
            message: 'Which package manager will be used with this project?',
            type: 'list',
            choices: Object.values(packageManagers),
            default: packageManagers.NPM
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE,
            message: 'What type of JavaScript project is this?',
            type: 'list',
            choices: [...Object.values(projectTypes), 'Other'],
            default: projectTypes.PACKAGE
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED,
            message: 'Should this package be scoped?',
            type: 'confirm',
            when: conditionals.shouldBeScopedPromptShouldBePresented,
            default: true
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.SCOPE,
            message: 'What is the scope?',
            when: scopePromptShouldBePresented,
            validate: scopeValidator,
            default: npmUser
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.AUTHOR_NAME,
            message: 'What is the author\'s name?',
            default: authorName
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.AUTHOR_EMAIL,
            message: 'What is the author\'s email?',
            default: authorEmail
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.AUTHOR_URL,
            message: 'What is the author\'s website url?',
            default: authorUrl
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.UNIT_TESTS,
            message: 'Will this project be unit tested?',
            type: 'confirm',
            default: true
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.INTEGRATION_TESTS,
            message: 'Will this project be integration tested?',
            type: 'confirm',
            default: true
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.CONFIGURE_LINTING,
            message: 'Will there be source code that should be linted?',
            type: 'confirm',
            when: conditionals.lintingPromptShouldBePresented
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.PROVIDE_EXAMPLE,
            message: 'Should an example be provided in the README?',
            type: 'confirm',
            when: conditionals.projectIsPackage
          },
          {
            name: JAVASCRIPT_BASE_DETAILS.HOST,
            type: 'list',
            message: 'Where will the application be hosted?',
            when: conditionals.projectIsApplication,
            choices: [...Object.keys(hosts), 'Other']
          }
        ]
      })
      .thenResolve({...answers, [JAVASCRIPT_BASE_DETAILS.CONFIGURE_LINTING]: any.word()});

    expect(await gatherBaseDetailsInput(hosts, visibility, vcs, configs, undefined, {logger, prompt})).toEqual({
      tests,
      projectType,
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
    const prompt = vi.fn();
    const npmUser = any.word();
    const get = vi.fn();
    npmConfFactory.mockReturnValue({get});
    when(execa).calledWith('npm', ['whoami']).thenResolve({stdout: npmUser});
    prompt.mockResolvedValue({...answers, [JAVASCRIPT_BASE_DETAILS.CONFIGURE_LINTING]: false});

    expect(await gatherBaseDetailsInput({}, visibility, vcs, undefined, undefined, {logger, prompt})).toEqual({
      tests,
      projectType,
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
    const prompt = vi.fn();
    when(execa).calledWith('npm', ['whoami']).thenResolve({stdout: any.word()});
    npmConfFactory.mockReturnValue({get: () => undefined});
    prompt.mockResolvedValue(answers);

    await gatherBaseDetailsInput({}, 'CS', vcs, null, pathWithinParent, {logger, prompt});

    const {questions} = prompt.mock.lastCall[0];
    expect(questions.filter(question => JAVASCRIPT_BASE_DETAILS.NODE_VERSION_CATEGORY === question.name).length)
      .toEqual(0);
  });

  it('should not ask whether closed source packages should be scoped', async () => {
    const prompt = vi.fn();
    when(execa).calledWith('npm', ['whoami']).thenResolve({stdout: any.word()});
    npmConfFactory.mockReturnValue({get: () => undefined});
    prompt.mockResolvedValue(answers);

    await gatherBaseDetailsInput({}, 'CS', vcs, null, pathWithinParent, {logger, prompt});

    const {questions} = prompt.mock.lastCall[0];
    expect(questions.filter(question => JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED === question.name).length).toEqual(0);
  });

  it('should not ask whether inner source packages should be scoped', async () => {
    const prompt = vi.fn();
    when(execa).calledWith('npm', ['whoami']).thenResolve({stdout: any.word()});
    npmConfFactory.mockReturnValue({get: () => undefined});
    prompt.mockResolvedValue(answers);

    await gatherBaseDetailsInput({}, 'ISS', vcs, null, pathWithinParent, {logger, prompt});

    const {questions} = prompt.mock.lastCall[0];
    expect(questions.filter(question => JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED === question.name).length).toEqual(0);
  });

  it('should handle a non-logged-in user gracefully', async () => {
    const prompt = vi.fn();
    when(execa).calledWith('npm', ['whoami']).thenReject(new Error());
    npmConfFactory.mockReturnValue({get: () => undefined});
    prompt.mockResolvedValue(answers);

    await gatherBaseDetailsInput({}, 'OSS', vcs, null, pathWithinParent, {logger, prompt});

    const {questions} = prompt.mock.lastCall[0];
    expect(questions.filter(question => JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED === question.name).length).toEqual(1);
  });
});
