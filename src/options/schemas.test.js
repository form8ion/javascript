import {validateOptions} from '@form8ion/core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {vcs} from './schemas.js';

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
});
