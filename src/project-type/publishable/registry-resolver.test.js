import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import resolveRegistry from './registry-resolver.js';

describe('registry resolver', () => {
  const scope = any.word();
  const scopedRegistry = any.url();
  const registry = any.url();

  it('should return undefined when no registries are defined', () => {
    expect(resolveRegistry(any.word())).toBeUndefined();
  });

  it('should return the main registry override when defined', () => {
    expect(resolveRegistry(any.word(), {registry})).toEqual(registry);
  });

  it('should return the scoped registry when the package is under a scope with a defined registry', () => {
    expect(resolveRegistry(`@${scope}/${any.word()}`, {[scope]: scopedRegistry})).toEqual(scopedRegistry);
  });

  it('should prefer the scoped registry over the main registry override', () => {
    expect(resolveRegistry(
      `@${scope}/${any.word()}`,
      {registry: any.url(), [scope]: scopedRegistry}
    )).toEqual(scopedRegistry);
  });

  it('should return undefined when no registry matches the package scope', () => {
    expect(resolveRegistry(`@${scope}/${any.word()}`, {[any.word()]: any.url()})).toBeUndefined();
  });

  it('should fall back to the main registry when the package is scoped but has no matching scope registry', () => {
    expect(resolveRegistry(`@${scope}/${any.word()}`, {registry})).toEqual(registry);
  });

  it('should return undefined when the package has no scope and no main registry is defined', () => {
    expect(resolveRegistry(any.word(), {[any.word()]: any.url()})).toBeUndefined();
  });
});
