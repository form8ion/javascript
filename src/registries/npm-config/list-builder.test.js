import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import buildList from './list-builder.js';

describe('registries list builder', () => {
  it('should define the default registry even if no registries are provided', () => {
    expect(buildList()).toEqual({registry: 'https://registry.npmjs.org'});
  });

  it('should enable overriding the default registry', () => {
    const registry = any.url();

    expect(buildList({registry})).toEqual({registry});
  });

  it('should enable defining scoped registries', () => {
    const registries = any.objectWithKeys(any.listOf(any.word), {factory: any.word});

    expect(buildList(registries)).toEqual({
      registry: 'https://registry.npmjs.org',
      ...Object.fromEntries(
        Object.entries(registries).map(([scope, url]) => ([`@${scope}:registry`, url]))
      )
    });
  });

  it('should enable defining scoped registries and overriding the default registry at the same time', () => {
    const registries = any.objectWithKeys(any.listOf(any.word), {factory: any.word});
    const registry = any.url();

    expect(buildList({...registries, registry})).toEqual({
      registry,
      ...Object.fromEntries(
        Object.entries(registries).map(([scope, url]) => ([`@${scope}:registry`, url]))
      )
    });
  });

  it('should not define the publish registry in the list', () => {
    expect(buildList({publish: any.url})).toEqual({registry: 'https://registry.npmjs.org'});
  });
});
