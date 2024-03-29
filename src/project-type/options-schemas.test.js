import {validateOptions} from '@form8ion/core';

import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import {
  packageBundlersSchema,
  applicationTypesSchema,
  packageTypesSchema,
  monorepoTypesSchema
} from './options-schemas.js';

describe('project-type options validation', () => {
  const key = any.word();

  describe('package bundlers', () => {
    it('should consider providing bundler plugins to be optional', () => {
      validateOptions(packageBundlersSchema);
    });

    it('should require a provided bundler to define a `scaffolder`', () => {
      expect(() => validateOptions(packageBundlersSchema, {[key]: {}})).toThrowError(`"${key}.scaffolder" is required`);
    });

    it('should require a defined `scaffolder` for a provided bundler to be a function', () => {
      expect(() => validateOptions(packageBundlersSchema, {[key]: {scaffolder: any.word()}}))
        .toThrowError(`"${key}.scaffolder" must be of type function`);
    });

    it('should require a defined `scaffolder` function for a provided bundler to take an options object', () => {
      expect(() => validateOptions(packageBundlersSchema, {[key]: {scaffolder: () => undefined}}))
        .toThrowError(`"${key}.scaffolder" must have an arity of 1`);
    });

    it('should consider bundler scaffolder function to be valid if an options object is provided', () => {
      const bundlerOptions = {[key]: {scaffolder: options => options}};

      expect(validateOptions(packageBundlersSchema, bundlerOptions)).toEqual(bundlerOptions);
    });

    it('should provide an empty object by default', () => {
      expect(validateOptions(packageBundlersSchema, undefined)).toEqual({});
    });
  });

  describe('application types', () => {
    it('should require a provided application-type to define config', () => {
      expect(() => validateOptions(applicationTypesSchema, {[key]: any.word()}))
        .toThrowError(`"${key}" must be of type object`);
    });

    it('should require a provided application-type to provide a scaffolder', () => {
      expect(() => validateOptions(applicationTypesSchema, {[key]: {}}))
        .toThrowError(`"${key}.scaffolder" is required`);
    });

    it('should require a provided application-type to provide a `scaffolder` function', () => {
      expect(() => validateOptions(applicationTypesSchema, {[key]: {scaffolder: any.word()}}))
        .toThrowError(`"${key}.scaffolder" must be of type function`);
    });

    it('should require the `scaffolder` for a provided application-type to accept a single argument', () => {
      expect(() => validateOptions(applicationTypesSchema, {[key]: {scaffolder: () => undefined}}))
        .toThrowError(`"${key}.scaffolder" must have an arity of 1`);
    });

    it('should consider a provided application-type to be valid if an options object is provided', () => {
      const options = {[key]: {scaffolder: scaffolderOptions => scaffolderOptions}};

      expect(validateOptions(applicationTypesSchema, options)).toEqual(options);
    });

    it('should provide an empty object by default if application-types are not provided', () => {
      expect(validateOptions(applicationTypesSchema, undefined)).toEqual({});
    });
  });

  describe('package types', () => {
    it('should require a provided package-type must define config', () => {
      expect(() => validateOptions(packageTypesSchema, {[key]: any.word()}))
        .toThrowError(`"${key}" must be of type object`);
    });

    it('should require a provided package-type to provide a `scaffolder`', () => {
      expect(() => validateOptions(packageTypesSchema, {[key]: {}}))
        .toThrowError(`"${key}.scaffolder" is required`);
    });

    it('should require a scaffolder for a provided package-type to be a function', () => {
      expect(() => validateOptions(packageTypesSchema, {[key]: {scaffolder: any.word()}}))
        .toThrowError(`"${key}.scaffolder" must be of type function`);
    });

    it('should require a scaffolder function for a provided package-type to accept a single argument', () => {
      expect(() => validateOptions(packageTypesSchema, {[key]: {scaffolder: () => undefined}}))
        .toThrowError(`"${key}.scaffolder" must have an arity of 1`);
    });

    it('should consider a provided package-type scaffolder to be valid if an options object is provided', () => {
      validateOptions(packageTypesSchema, {[key]: {scaffolder: options => options}});
    });

    it('should provide an empty object by default if package-types are not provided', () => {
      expect(validateOptions(packageTypesSchema, undefined)).toEqual({});
    });
  });

  describe('monorepo types', () => {
    it('should require a provided monorepo-type must define config', () => {
      expect(() => validateOptions(monorepoTypesSchema, {[key]: any.word()}))
        .toThrowError(`"${key}" must be of type object`);
    });

    it('should require a provided monorepo-type to provide a `scaffolder`', () => {
      expect(() => validateOptions(monorepoTypesSchema, {[key]: {}}))
        .toThrowError(`"${key}.scaffolder" is required`);
    });

    it('should require a scaffolder for a provided monorepo-type to be a function', () => {
      expect(() => validateOptions(monorepoTypesSchema, {[key]: {scaffolder: any.word()}}))
        .toThrowError(`"${key}.scaffolder" must be of type function`);
    });

    it('should require a scaffolder function for a provided monorepo-type to accept a single argument', () => {
      expect(() => validateOptions(monorepoTypesSchema, {[key]: {scaffolder: () => undefined}}))
        .toThrowError(`"${key}.scaffolder" must have an arity of 1`);
    });

    it('should consider a provided monorepo-type scaffolder to be valid if an options object is provided', () => {
      validateOptions(monorepoTypesSchema, {[key]: {scaffolder: options => options}});
    });

    it('should provide an empty object by default if monorepo-types are not provided', () => {
      expect(validateOptions(monorepoTypesSchema, undefined)).toEqual({});
    });
  });
});
