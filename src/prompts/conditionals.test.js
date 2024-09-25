import {questionNames as commonQuestionNames} from '@travi/language-scaffolder-prompts';
import {projectTypes} from '@form8ion/javascript-core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {questionNames} from './question-names.js';
import {
  lintingPromptShouldBePresented,
  projectIsApplication,
  scopePromptShouldBePresentedFactory,
  shouldBeScopedPromptShouldBePresented
} from './conditionals.js';

describe('javascript prompt conditionals', () => {
  describe('scope', () => {
    it('should present the prompt for whether the package should be scoped for `package` project-types', () => {
      expect(shouldBeScopedPromptShouldBePresented({[questionNames.PROJECT_TYPE]: projectTypes.PACKAGE})).toBe(true);
    });

    it('should present the prompt for whether the package should be scoped for `cli` project-types', () => {
      expect(shouldBeScopedPromptShouldBePresented({[questionNames.PROJECT_TYPE]: projectTypes.CLI})).toBe(true);
    });

    it('shouldnt present the prompt for whether the package should be scoped for non-publishable project-types', () => {
      expect(shouldBeScopedPromptShouldBePresented({[questionNames.PROJECT_TYPE]: any.string()})).toBe(false);
    });

    it('should present a scope prompt when a package should be scoped', () => {
      expect(scopePromptShouldBePresentedFactory()({
        [questionNames.SHOULD_BE_SCOPED]: true,
        [questionNames.PROJECT_TYPE]: projectTypes.PACKAGE
      })).toBe(true);
    });

    it('should present a scope prompt when a package is private, because they must be scoped', () => {
      expect(scopePromptShouldBePresentedFactory('Private')({
        [questionNames.SHOULD_BE_SCOPED]: false,
        [questionNames.PROJECT_TYPE]: projectTypes.PACKAGE
      })).toBe(true);
    });

    it('should present a scope prompt when a CLI should be scoped', () => {
      expect(scopePromptShouldBePresentedFactory()({
        [questionNames.SHOULD_BE_SCOPED]: true,
        [questionNames.PROJECT_TYPE]: projectTypes.CLI
      })).toBe(true);
    });

    it('should present a scope prompt when a CLI is private, because they must be scoped', () => {
      expect(scopePromptShouldBePresentedFactory('Private')({
        [questionNames.SHOULD_BE_SCOPED]: false,
        [questionNames.PROJECT_TYPE]: projectTypes.CLI
      })).toBe(true);
    });

    it('should not present a scope prompt when an application is private', () => {
      expect(scopePromptShouldBePresentedFactory('Private')({
        [questionNames.SHOULD_BE_SCOPED]: false,
        [questionNames.PROJECT_TYPE]: projectTypes.APPLICATION
      })).toBe(false);
    });

    it('should not preset a scope prompt for non-publishable projects', () => {
      expect(scopePromptShouldBePresentedFactory()({[questionNames.SHOULD_BE_SCOPED]: false})).toBe(false);
    });
  });

  describe('application', () => {
    it('should return `true` when the package-type is `Application`', () => {
      expect(projectIsApplication({[questionNames.PROJECT_TYPE]: projectTypes.APPLICATION})).toBe(true);
    });

    it('should return `false` when the project-type is not an application', () => {
      expect(projectIsApplication({[questionNames.PROJECT_TYPE]: any.word()})).toBe(false);
    });
  });

  describe('transpilation/linting', () => {
    it('should not show the prompt if the project is unit tested ', () => {
      expect(lintingPromptShouldBePresented({[commonQuestionNames.UNIT_TESTS]: true})).toBe(false);
    });

    it('should not show the prompt if the project is integration tested', () => {
      expect(lintingPromptShouldBePresented({[commonQuestionNames.INTEGRATION_TESTS]: true})).toBe(false);
    });

    it('should show the prompt if the project is not tested', () => {
      expect(lintingPromptShouldBePresented({
        [commonQuestionNames.INTEGRATION_TESTS]: false,
        [commonQuestionNames.UNIT_TESTS]: false
      })).toBe(true);
    });
  });
});
