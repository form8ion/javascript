import {projectTypes} from '@form8ion/javascript-core';

import {questionNames} from './question-names.js';

const {JAVASCRIPT_BASE_DETAILS} = questionNames;

function projectIsCLI(answers) {
  return projectTypes.CLI === answers[JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE];
}

export function projectIsPackage(answers) {
  return projectTypes.PACKAGE === answers[JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE];
}

export function projectIsApplication(answers) {
  return projectTypes.APPLICATION === answers[JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE];
}

function packageShouldBeScoped(visibility, answers) {
  return ['ISS', 'CS'].includes(visibility) || answers[JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED];
}

function willBePublishedToRegistry(answers) {
  return projectIsPackage(answers) || projectIsCLI(answers);
}

export function shouldBeScopedPromptShouldBePresented(answers) {
  return willBePublishedToRegistry(answers);
}

export function scopePromptShouldBePresentedFactory(visibility) {
  return answers => willBePublishedToRegistry(answers) && packageShouldBeScoped(visibility, answers);
}

export function lintingPromptShouldBePresented({
  [JAVASCRIPT_BASE_DETAILS.UNIT_TESTS]: unitTested,
  [JAVASCRIPT_BASE_DETAILS.INTEGRATION_TESTS]: integrationTested
}) {
  return !unitTested && !integrationTested;
}
