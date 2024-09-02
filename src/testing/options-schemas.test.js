import {validateOptions} from '@form8ion/core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {unitTestFrameworksSchema} from './options-schemas.js';

describe('unit testing options validation', () => {
  const key = any.word();

  it('should require that a provided framework define a `scaffolder`', () => {
    expect(() => validateOptions(unitTestFrameworksSchema, {[key]: {scaffold: any.word()}}))
      .toThrowError(`"${key}.scaffold" must be of type function`);
  });

  it('should require that the `scaffold` defined by a provided framework take an options object', () => {
    expect(() => validateOptions(unitTestFrameworksSchema, {[key]: {scaffold: () => undefined}}))
      .toThrowError(`"${key}.scaffold" must have an arity greater or equal to 1`);
  });

  it('should consider a provided framework definition valid if the scaffolder accepts an options object', () => {
    validateOptions(unitTestFrameworksSchema, {[key]: {scaffold: options => options}});
  });

  it('should provide an empty object by default', () => {
    expect(validateOptions(unitTestFrameworksSchema, undefined)).toEqual({});
  });
});
