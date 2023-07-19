import {validateOptions} from '@form8ion/core';

import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import {packageBundlersSchema} from './options-schemas';

describe('project-type options validation', () => {
  describe('package bundlers', () => {
    const key = any.word();

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
});
