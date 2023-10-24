import {validateOptions} from '@form8ion/core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {unitTestFrameworksSchema} from './options-schemas.js';

describe('unit testing options validation', () => {
  const key = any.word();

  it('should require the options', () => {
    expect(() => validateOptions(unitTestFrameworksSchema)).toThrowError('"value" is required');
  });

  it('should require that a provided framework define a `scaffolder`', () => {
    expect(() => validateOptions(unitTestFrameworksSchema, {[key]: {scaffolder: any.word()}}))
      .toThrowError(`"${key}.scaffolder" must be of type function`);
  });

  it('should require that the `scaffolder` defined by a provided framework take an options object', () => {
    expect(() => validateOptions(unitTestFrameworksSchema, {[key]: {scaffolder: () => undefined}}))
      .toThrowError(`"${key}.scaffolder" must have an arity of 1`);
  });

  it('should consider a provided framework definition valid if the scaffolder accepts an options object', () => {
    validateOptions(unitTestFrameworksSchema, {[key]: {scaffolder: options => options}});
  });
});
