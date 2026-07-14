import {projectTypes} from '@form8ion/javascript-core';

import {questionNames} from './question-names.js';

function projectIsCLI(answers) {
  return projectTypes.CLI === answers[questionNames.PROJECT_TYPE];
}

export function projectIsPackage(answers) {
  return projectTypes.PACKAGE === answers[questionNames.PROJECT_TYPE];
}

export function projectIsApplication(answers) {
  return projectTypes.APPLICATION === answers[questionNames.PROJECT_TYPE];
}

function packageShouldBeScoped(visibility, answers) {
  return ['ISS', 'CS'].includes(visibility) || answers[questionNames.SHOULD_BE_SCOPED];
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
  [questionNames.UNIT_TESTS]: unitTested,
  [questionNames.INTEGRATION_TESTS]: integrationTested
}) {
  return !unitTested && !integrationTested;
}
