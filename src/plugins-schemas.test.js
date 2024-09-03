import {validateOptions} from '@form8ion/core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {pluginsSchema} from './plugins-schemas.js';

describe('plugins schemas', () => {
  const key = any.word();

  it('should require that a provided framework define a `scaffolder`', () => {
    expect(() => validateOptions(pluginsSchema, {[key]: {scaffold: any.word()}}))
      .toThrowError(`"${key}.scaffold" must be of type function`);
  });

  it('should require that the `scaffold` defined by a provided framework take an options object', () => {
    expect(() => validateOptions(pluginsSchema, {[key]: {scaffold: () => undefined}}))
      .toThrowError(`"${key}.scaffold" must have an arity greater or equal to 1`);
  });

  it('should consider a provided framework definition valid if the scaffolder accepts an options object', () => {
    validateOptions(pluginsSchema, {[key]: {scaffold: options => options}});
  });

  it('should provide an empty object by default', () => {
    expect(validateOptions(pluginsSchema, undefined)).toEqual({});
  });
});
