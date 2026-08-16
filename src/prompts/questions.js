import {packageManagers, projectTypes} from '@form8ion/javascript-core';

import {execa} from 'execa';
import npmConfFactory from '../../thirdparty-wrappers/npm-conf.js';
import buildDialectChoices from '../dialects/prompt-choices.js';
import {
  lintingPromptShouldBePresented,
  projectIsApplication,
  projectIsPackage,
  scopePromptShouldBePresentedFactory,
  shouldBeScopedPromptShouldBePresented
} from './conditionals.js';
import {questionNames} from './question-names.js';
import {scope as validateScope} from './validators.js';

export const JAVASCRIPT_BASE_DETAILS_PROMPT_ID = 'JAVASCRIPT_BASE_DETAILS';

const {
  AUTHOR_NAME,
  AUTHOR_EMAIL,
  AUTHOR_URL,
  UNIT_TESTS,
  INTEGRATION_TESTS,
  PROVIDE_EXAMPLE,
  PROJECT_TYPE,
  HOST,
  SHOULD_BE_SCOPED,
  SCOPE,
  NODE_VERSION_CATEGORY,
  CONFIGURE_LINTING,
  PACKAGE_MANAGER,
  DIALECT
} = questionNames[JAVASCRIPT_BASE_DETAILS_PROMPT_ID];

function authorQuestions({name, email, url}) {
  return [
    {
      name: AUTHOR_NAME,
      message: 'What is the author\'s name?',
      default: name
    },
    {
      name: AUTHOR_EMAIL,
      message: 'What is the author\'s email?',
      default: email
    },
    {
      name: AUTHOR_URL,
      message: 'What is the author\'s website url?',
      default: url
    }
  ];
}

export async function gatherBaseDetailsInput(
  hosts,
  visibility,
  vcs,
  configs,
  pathWithinParent,
  {logger, prompt}
) {
  const npmConf = npmConfFactory();

  let maybeLoggedInNpmUsername;
  try {
    maybeLoggedInNpmUsername = (await execa('npm', ['whoami'])).stdout;
  } catch (failedExecutionResult) {
    logger.warn('No logged in user found with `npm whoami`. Login with `npm login` '
      + 'to use your npm account name as the package scope default.');
  }

  const {
    [UNIT_TESTS]: unitTested,
    [INTEGRATION_TESTS]: integrationTested,
    [PROJECT_TYPE]: projectType,
    [HOST]: chosenHost,
    [SCOPE]: scope,
    [NODE_VERSION_CATEGORY]: nodeVersionCategory,
    [AUTHOR_NAME]: authorName,
    [AUTHOR_EMAIL]: authorEmail,
    [AUTHOR_URL]: authorUrl,
    [CONFIGURE_LINTING]: configureLinting,
    [PROVIDE_EXAMPLE]: provideExample,
    [PACKAGE_MANAGER]: packageManager,
    [DIALECT]: dialect
  } = await prompt({
    id: JAVASCRIPT_BASE_DETAILS_PROMPT_ID,
    questions: [
      {
        name: DIALECT,
        message: 'Which JavaScript dialect should this project follow?',
        type: 'list',
        choices: buildDialectChoices(configs),
        default: 'babel'
      },
      ...pathWithinParent ? [] : [{
        name: NODE_VERSION_CATEGORY,
        message: 'What node.js version should be used?',
        type: 'list',
        choices: ['LTS', 'Latest'],
        default: 'LTS'
      }],
      {
        name: PACKAGE_MANAGER,
        message: 'Which package manager will be used with this project?',
        type: 'list',
        choices: Object.values(packageManagers),
        default: packageManagers.NPM
      },
      {
        name: PROJECT_TYPE,
        message: 'What type of JavaScript project is this?',
        type: 'list',
        choices: [...Object.values(projectTypes), 'Other'],
        default: projectTypes.PACKAGE
      },
      ...['ISS', 'CS'].includes(visibility) ? [] : [{
        name: SHOULD_BE_SCOPED,
        message: 'Should this package be scoped?',
        type: 'confirm',
        when: shouldBeScopedPromptShouldBePresented,
        default: true
      }],
      {
        name: SCOPE,
        message: 'What is the scope?',
        when: scopePromptShouldBePresentedFactory(visibility),
        validate: validateScope(visibility),
        default: maybeLoggedInNpmUsername
      },
      ...authorQuestions({
        name: npmConf.get('init.author.name'),
        email: npmConf.get('init.author.email'),
        url: npmConf.get('init.author.url')
      }),
      {
        name: UNIT_TESTS,
        message: 'Will this project be unit tested?',
        type: 'confirm',
        default: true
      },
      {
        name: INTEGRATION_TESTS,
        message: 'Will this project be integration tested?',
        type: 'confirm',
        default: true
      },
      {
        name: CONFIGURE_LINTING,
        message: 'Will there be source code that should be linted?',
        type: 'confirm',
        when: lintingPromptShouldBePresented
      },
      {
        name: PROVIDE_EXAMPLE,
        message: 'Should an example be provided in the README?',
        type: 'confirm',
        when: projectIsPackage
      },
      {
        name: HOST,
        type: 'list',
        message: 'Where will the application be hosted?',
        when: projectIsApplication,
        choices: [...Object.keys(hosts), 'Other']
      }
    ]
  });

  return {
    tests: {unit: unitTested, integration: integrationTested},
    projectType,
    chosenHost,
    scope,
    nodeVersionCategory,
    author: {name: authorName, email: authorEmail, url: authorUrl},
    configureLinting: false !== configureLinting,
    provideExample,
    packageManager,
    dialect
  };
}
