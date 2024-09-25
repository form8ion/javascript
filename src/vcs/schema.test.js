import {validateOptions} from '@form8ion/core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {vcsSchema} from './schema.js';

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
