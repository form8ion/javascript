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

    it('should require a provided bundler to define a `scaffold`', () => {
      expect(() => validateOptions(packageBundlersSchema, {[key]: {}})).toThrowError(`"${key}.scaffold" is required`);
    });

    it('should require a defined `scaffold` for a provided bundler to be a function', () => {
      expect(() => validateOptions(packageBundlersSchema, {[key]: {scaffold: any.word()}}))
        .toThrowError(`"${key}.scaffold" must be of type function`);
    });

    it('should require a defined `scaffold` function for a provided bundler to take an options object', () => {
      expect(() => validateOptions(packageBundlersSchema, {[key]: {scaffold: () => undefined}}))
        .toThrowError(`"${key}.scaffold" must have an arity greater or equal to 1`);
    });

    it('should consider bundler scaffold function to be valid if an options object is provided', () => {
      const bundlerOptions = {[key]: {scaffold: options => options}};

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

    it('should require a provided application-type to provide a scaffold', () => {
      expect(() => validateOptions(applicationTypesSchema, {[key]: {}}))
        .toThrowError(`"${key}.scaffold" is required`);
    });

    it('should require a provided application-type to provide a `scaffold` function', () => {
      expect(() => validateOptions(applicationTypesSchema, {[key]: {scaffold: any.word()}}))
        .toThrowError(`"${key}.scaffold" must be of type function`);
    });

    it('should require the `scaffold` for a provided application-type to accept a single argument', () => {
      expect(() => validateOptions(applicationTypesSchema, {[key]: {scaffold: () => undefined}}))
        .toThrowError(`"${key}.scaffold" must have an arity greater or equal to 1`);
    });

    it('should consider a provided application-type to be valid if an options object is provided', () => {
      const options = {[key]: {scaffold: scaffolderOptions => scaffolderOptions}};

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

    it('should require a provided package-type to provide a `scaffold`', () => {
      expect(() => validateOptions(packageTypesSchema, {[key]: {}}))
        .toThrowError(`"${key}.scaffold" is required`);
    });

    it('should require a scaffold for a provided package-type to be a function', () => {
      expect(() => validateOptions(packageTypesSchema, {[key]: {scaffold: any.word()}}))
        .toThrowError(`"${key}.scaffold" must be of type function`);
    });

    it('should require a scaffold function for a provided package-type to accept a single argument', () => {
      expect(() => validateOptions(packageTypesSchema, {[key]: {scaffold: () => undefined}}))
        .toThrowError(`"${key}.scaffold" must have an arity greater or equal to 1`);
    });

    it('should consider a provided package-type scaffold to be valid if an options object is provided', () => {
      validateOptions(packageTypesSchema, {[key]: {scaffold: options => options}});
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

    it('should require a provided monorepo-type to provide a `scaffold`', () => {
      expect(() => validateOptions(monorepoTypesSchema, {[key]: {}}))
        .toThrowError(`"${key}.scaffold" is required`);
    });

    it('should require a scaffold for a provided monorepo-type to be a function', () => {
      expect(() => validateOptions(monorepoTypesSchema, {[key]: {scaffold: any.word()}}))
        .toThrowError(`"${key}.scaffold" must be of type function`);
    });

    it('should require a scaffold function for a provided monorepo-type to accept a single argument', () => {
      expect(() => validateOptions(monorepoTypesSchema, {[key]: {scaffold: () => undefined}}))
        .toThrowError(`"${key}.scaffold" must have an arity greater or equal to 1`);
    });

    it('should consider a provided monorepo-type scaffold to be valid if an options object is provided', () => {
      validateOptions(monorepoTypesSchema, {[key]: {scaffold: options => options}});
    });

    it('should provide an empty object by default if monorepo-types are not provided', () => {
      expect(validateOptions(monorepoTypesSchema, undefined)).toEqual({});
    });
  });
});
