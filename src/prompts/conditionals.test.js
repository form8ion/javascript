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

const {JAVASCRIPT_BASE_DETAILS} = questionNames;

describe('javascript prompt conditionals', () => {
  describe('scope', () => {
    it('should present the prompt for whether the package should be scoped for `package` project-types', () => {
      expect(shouldBeScopedPromptShouldBePresented({[JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.PACKAGE}))
        .toBe(true);
    });

    it('should present the prompt for whether the package should be scoped for `cli` project-types', () => {
      expect(shouldBeScopedPromptShouldBePresented({[JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.CLI}))
        .toBe(true);
    });

    it('shouldnt present the prompt for whether the package should be scoped for non-publishable project-types', () => {
      expect(shouldBeScopedPromptShouldBePresented({[JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: any.string()})).toBe(false);
    });

    it('should present a scope prompt when a package should be scoped', () => {
      expect(scopePromptShouldBePresentedFactory()({
        [JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: true,
        [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.PACKAGE
      })).toBe(true);
    });

    it('should present a scope prompt when a package is inner source, because they must be scoped', () => {
      expect(scopePromptShouldBePresentedFactory('ISS')({
        [JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: false,
        [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.PACKAGE
      })).toBe(true);
    });

    it('should present a scope prompt when a package is closed source, because they must be scoped', () => {
      expect(scopePromptShouldBePresentedFactory('CS')({
        [JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: false,
        [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.PACKAGE
      })).toBe(true);
    });

    it('should present a scope prompt when a CLI should be scoped', () => {
      expect(scopePromptShouldBePresentedFactory()({
        [JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: true,
        [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.CLI
      })).toBe(true);
    });

    it('should present a scope prompt when a CLI is closed source, because they must be scoped', () => {
      expect(scopePromptShouldBePresentedFactory('CS')({
        [JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: false,
        [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.CLI
      })).toBe(true);
    });

    it('should present a scope prompt when a CLI is inner source, because they must be scoped', () => {
      expect(scopePromptShouldBePresentedFactory('ISS')({
        [JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: false,
        [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.CLI
      })).toBe(true);
    });

    it('should not present a scope prompt when an application is closed source', () => {
      expect(scopePromptShouldBePresentedFactory('CS')({
        [JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: false,
        [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.APPLICATION
      })).toBe(false);
    });

    it('should not present a scope prompt when an application is inner source', () => {
      expect(scopePromptShouldBePresentedFactory('ISS')({
        [JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: false,
        [JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.APPLICATION
      })).toBe(false);
    });

    it('should not preset a scope prompt for non-publishable projects', () => {
      expect(scopePromptShouldBePresentedFactory()({[JAVASCRIPT_BASE_DETAILS.SHOULD_BE_SCOPED]: false})).toBe(false);
    });
  });

  describe('application', () => {
    it('should return `true` when the package-type is `Application`', () => {
      expect(projectIsApplication({[JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: projectTypes.APPLICATION})).toBe(true);
    });

    it('should return `false` when the project-type is not an application', () => {
      expect(projectIsApplication({[JAVASCRIPT_BASE_DETAILS.PROJECT_TYPE]: any.word()})).toBe(false);
    });
  });

  describe('transpilation/linting', () => {
    it('should not show the prompt if the project is unit tested ', () => {
      expect(lintingPromptShouldBePresented({[JAVASCRIPT_BASE_DETAILS.UNIT_TESTS]: true})).toBe(false);
    });

    it('should not show the prompt if the project is integration tested', () => {
      expect(lintingPromptShouldBePresented({[JAVASCRIPT_BASE_DETAILS.INTEGRATION_TESTS]: true})).toBe(false);
    });

    it('should show the prompt if the project is not tested', () => {
      expect(lintingPromptShouldBePresented({
        [JAVASCRIPT_BASE_DETAILS.INTEGRATION_TESTS]: false,
        [JAVASCRIPT_BASE_DETAILS.UNIT_TESTS]: false
      })).toBe(true);
    });
  });
});
