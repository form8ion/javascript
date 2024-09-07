import {validateOptions} from '@form8ion/core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {vcs, configs, scopeBasedConfigSchema} from './schemas.js';

describe('options schemas', () => {
  describe('vcs', () => {
    it('should require `vcs` to be an object', () => {
      expect(() => validateOptions(vcs, {vcs: []})).toThrowError('"vcs" must be of type object');
    });

    it('should require `vcs.host`', () => {
      expect(() => validateOptions(vcs, {vcs: {}})).toThrowError('"vcs.host" is required');
    });

    it('should require `vcs.host` to be a string', () => {
      expect(() => validateOptions(vcs, {vcs: {host: any.integer()}}))
        .toThrowError('"vcs.host" must be a string');
    });

    it('should require `vcs.owner`', () => {
      expect(() => validateOptions(vcs, {vcs: {host: any.word()}})).toThrowError('"vcs.owner" is required');
    });

    it('should require `vcs.host` to be a string', () => {
      expect(() => validateOptions(vcs, {vcs: {host: any.word(), owner: any.integer()}}))
        .toThrowError('"vcs.owner" must be a string');
    });

    it('should require `vcs.name`', () => {
      expect(() => validateOptions(vcs, {vcs: {host: any.word(), owner: any.word()}}))
        .toThrowError('"vcs.name" is required');
    });

    it('should require `vcs.name` to be a string', () => {
      expect(() => validateOptions(vcs, {vcs: {host: any.word(), owner: any.word(), name: any.integer()}}))
        .toThrowError('"vcs.name" must be a string');
    });
  });

  describe('configs', () => {
    it('should return an empty object when no `configs` are provided', () => {
      expect(validateOptions(configs)).toEqual({});
    });

    it('should require `remark` to be a string, when provided', () => {
      expect(() => validateOptions(configs, {remark: any.integer()})).toThrowError('"remark" must be a string');
    });

    it('should allow all configs to be populated', () => {
      const options = {remark: any.word()};

      expect(validateOptions(configs, options)).toEqual(options);
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
});
