import {packageManagers, projectTypes} from '@form8ion/javascript-core';
import {prompt as promptWithInquirer} from '@form8ion/overridable-prompts';

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

export const BASE_DETAILS_PROMPT_ID = 'base-details';

const {BASE_DETAILS} = questionNames;

function authorQuestions({name, email, url}) {
  return [
    {
      name: BASE_DETAILS.AUTHOR_NAME,
      message: 'What is the author\'s name?',
      default: name
    },
    {
      name: BASE_DETAILS.AUTHOR_EMAIL,
      message: 'What is the author\'s email?',
      default: email
    },
    {
      name: BASE_DETAILS.AUTHOR_URL,
      message: 'What is the author\'s website url?',
      default: url
    }
  ];
}

export async function prompt(
  hosts,
  visibility,
  vcs,
  decisions,
  configs,
  pathWithinParent,
  {logger}
) {
  const npmConf = npmConfFactory();

  let maybeLoggedInNpmUsername;
  try {
    maybeLoggedInNpmUsername = (await execa('npm', ['whoami'])).stdout;
  } catch (failedExecutionResult) {
    if (!decisions[BASE_DETAILS.SCOPE]) {
      logger.warn('No logged in user found with `npm whoami`. Login with `npm login` '
        + 'to use your npm account name as the package scope default.');
    }
  }

  const {
    [BASE_DETAILS.UNIT_TESTS]: unitTested,
    [BASE_DETAILS.INTEGRATION_TESTS]: integrationTested,
    [BASE_DETAILS.PROJECT_TYPE]: projectType,
    [BASE_DETAILS.HOST]: chosenHost,
    [BASE_DETAILS.SCOPE]: scope,
    [BASE_DETAILS.NODE_VERSION_CATEGORY]: nodeVersionCategory,
    [BASE_DETAILS.AUTHOR_NAME]: authorName,
    [BASE_DETAILS.AUTHOR_EMAIL]: authorEmail,
    [BASE_DETAILS.AUTHOR_URL]: authorUrl,
    [BASE_DETAILS.CONFIGURE_LINTING]: configureLinting,
    [BASE_DETAILS.PROVIDE_EXAMPLE]: provideExample,
    [BASE_DETAILS.PACKAGE_MANAGER]: packageManager,
    [BASE_DETAILS.DIALECT]: dialect
  } = await promptWithInquirer([
    {
      name: BASE_DETAILS.DIALECT,
      message: 'Which JavaScript dialect should this project follow?',
      type: 'list',
      choices: buildDialectChoices(configs),
      default: 'babel'
    },
    ...pathWithinParent ? [] : [{
      name: BASE_DETAILS.NODE_VERSION_CATEGORY,
      message: 'What node.js version should be used?',
      type: 'list',
      choices: ['LTS', 'Latest'],
      default: 'LTS'
    }],
    {
      name: BASE_DETAILS.PACKAGE_MANAGER,
      message: 'Which package manager will be used with this project?',
      type: 'list',
      choices: Object.values(packageManagers),
      default: packageManagers.NPM
    },
    {
      name: BASE_DETAILS.PROJECT_TYPE,
      message: 'What type of JavaScript project is this?',
      type: 'list',
      choices: [...Object.values(projectTypes), 'Other'],
      default: projectTypes.PACKAGE
    },
    ...['ISS', 'CS'].includes(visibility) ? [] : [{
      name: BASE_DETAILS.SHOULD_BE_SCOPED,
      message: 'Should this package be scoped?',
      type: 'confirm',
      when: shouldBeScopedPromptShouldBePresented,
      default: true
    }],
    {
      name: BASE_DETAILS.SCOPE,
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
      name: BASE_DETAILS.UNIT_TESTS,
      message: 'Will this project be unit tested?',
      type: 'confirm',
      default: true
    },
    {
      name: BASE_DETAILS.INTEGRATION_TESTS,
      message: 'Will this project be integration tested?',
      type: 'confirm',
      default: true
    },
    {
      name: BASE_DETAILS.CONFIGURE_LINTING,
      message: 'Will there be source code that should be linted?',
      type: 'confirm',
      when: lintingPromptShouldBePresented
    },
    {
      name: BASE_DETAILS.PROVIDE_EXAMPLE,
      message: 'Should an example be provided in the README?',
      type: 'confirm',
      when: projectIsPackage
    },
    {
      name: BASE_DETAILS.HOST,
      type: 'list',
      message: 'Where will the application be hosted?',
      when: projectIsApplication,
      choices: [...Object.keys(hosts), 'Other']
    }
  ], decisions);

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
