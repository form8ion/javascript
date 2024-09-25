import {validateOptions} from '@form8ion/core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {
  nameBasedConfigSchema,
  projectNameSchema,
  registriesSchema,
  scopeBasedConfigSchema,
  visibilitySchema
} from './schemas.js';

describe('options schemas', () => {
  describe('scope-based configs', () => {
    it('should require a provided config to be an object', () => {
      expect(() => validateOptions(scopeBasedConfigSchema, any.word())).toThrowError('"value" must be of type object');
    });

    it('should require a provided config to have a `scope` property', () => {
      expect(() => validateOptions(scopeBasedConfigSchema, {})).toThrowError('"scope" is required');
    });

    it('should require the `scope` to be a string', () => {
      expect(() => validateOptions(scopeBasedConfigSchema, {scope: any.simpleObject()}))
        .toThrowError('"scope" must be a string');
    });

    it('should require the `scope` to start with `@`', () => {
      const scope = any.word();

      expect(() => validateOptions(scopeBasedConfigSchema, {scope}))
        .toThrowError(`"scope" with value "${scope}" fails to match the scope pattern`);
    });

    it('should not allow the `scope` to contain a `/`', () => {
      const scope = `@${any.word()}/${any.word()}`;

      expect(() => validateOptions(scopeBasedConfigSchema, {scope}))
        .toThrowError(`"scope" with value "${scope}" fails to match the scope pattern`);
    });

    it('should allow `scope` to contain `-`', () => {
      const scope = `@${any.word()}-${any.word()}`;

      expect(validateOptions(scopeBasedConfigSchema, {scope})).toEqual({scope});
    });
  });

  describe('name-based configs', () => {
    it('should require a provided config to be an object', () => {
      expect(() => validateOptions(nameBasedConfigSchema, any.word())).toThrowError('"value" must be of type object');
    });

    it('should require a provided config to have a `packageName` property', () => {
      expect(() => validateOptions(nameBasedConfigSchema, {})).toThrowError('"packageName" is required');
    });

    it('should require the `packageName` to be a string', () => {
      expect(() => validateOptions(nameBasedConfigSchema, {packageName: any.simpleObject()}))
        .toThrowError('"packageName" must be a string');
    });

    it('should require a provided config to have a `name` property', () => {
      expect(() => validateOptions(nameBasedConfigSchema, {packageName: any.word()}))
        .toThrowError('"name" is required');
    });

    it('should require the `name` to be a string', () => {
      expect(() => validateOptions(nameBasedConfigSchema, {packageName: any.word(), name: any.simpleObject()}))
        .toThrowError('"name" must be a string');
    });
  });

  describe('registries', () => {
    const key = any.word();

    it('should return an empty object when no registries are provided', () => {
      expect(validateOptions(registriesSchema)).toEqual({});
    });

    it('should return the validated registries when valid', () => {
      const registries = {[any.word()]: any.url()};

      expect(validateOptions(registriesSchema, registries)).toEqual(registries);
    });

    it('should require the `registries` definition to be an object', () => {
      expect(() => validateOptions(registriesSchema, any.word())).toThrowError('"value" must be of type object');
    });

    it('should require the values to be strings', () => {
      expect(() => validateOptions(registriesSchema, {[key]: any.integer()})).toThrowError(`"${key}" must be a string`);
    });

    it('should require the values to be URIs', () => {
      expect(() => validateOptions(registriesSchema, {[key]: any.string()}))
        .toThrowError(`"${key}" must be a valid uri`);
    });
  });

  describe('visibility', () => {
    it('should require a value to be provided', () => {
      expect(() => validateOptions(visibilitySchema)).toThrowError('"value" is required');
    });

    it('should allow `Public` as a valid value', () => {
      const visibility = 'Public';

      expect(validateOptions(visibilitySchema, visibility)).toEqual(visibility);
    });

    it('should allow `Private` as a valid value', () => {
      const visibility = 'Private';

      expect(validateOptions(visibilitySchema, visibility)).toEqual(visibility);
    });

    it('should consider values other than `Public` and `Private` as invalid', () => {
      expect(() => validateOptions(visibilitySchema, any.word()))
        .toThrowError('"value" must be one of [Public, Private]');
    });
  });

  describe('project name', () => {
    it('should return the validated name', () => {
      const projectName = any.word();

      expect(validateOptions(projectNameSchema, projectName)).toEqual(projectName);
    });

    it('should require a value to be provided', () => {
      expect(() => validateOptions(projectNameSchema)).toThrowError('"value" is required');
    });

    it('should require a value to be a string', () => {
      expect(() => validateOptions(projectNameSchema, any.simpleObject())).toThrowError('"value" must be a string');
    });

    it('should prevent the project name from including a scope', () => {
      const projectName = `@${any.word()}/${any.word()}`;

      expect(() => validateOptions(projectNameSchema, projectName))
        .toThrowError(`"value" with value "${projectName}" matches the inverted pattern: /^@\\w*\\//`);
    });
  });
});
