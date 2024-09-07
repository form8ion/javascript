import {validateOptions} from '@form8ion/core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {scopeBasedConfigSchema, nameBasedConfigSchema, registriesSchema, vcsSchema} from './schemas.js';

describe('options schemas', () => {
  describe('vcs', () => {
    it('should require `vcs` to be an object', () => {
      expect(() => validateOptions(vcsSchema, [])).toThrowError('"value" must be of type object');
    });

    it('should require `host`', () => {
      expect(() => validateOptions(vcsSchema, {})).toThrowError('"host" is required');
    });

    it('should require `host` to be a string', () => {
      expect(() => validateOptions(vcsSchema, {host: any.integer()}))
        .toThrowError('"host" must be a string');
    });

    it('should require `owner`', () => {
      expect(() => validateOptions(vcsSchema, {host: any.word()})).toThrowError('"owner" is required');
    });

    it('should require `owner` to be a string', () => {
      expect(() => validateOptions(vcsSchema, {host: any.word(), owner: any.integer()}))
        .toThrowError('"owner" must be a string');
    });

    it('should require `name`', () => {
      expect(() => validateOptions(vcsSchema, {host: any.word(), owner: any.word()}))
        .toThrowError('"name" is required');
    });

    it('should require `name` to be a string', () => {
      expect(() => validateOptions(vcsSchema, {host: any.word(), owner: any.word(), name: any.integer()}))
        .toThrowError('"name" must be a string');
    });
  });

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
});
