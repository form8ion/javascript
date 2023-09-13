import {expect, it, describe} from 'vitest';
import any from '@travi/any';

import buildAllowedHostsList from './allowed-hosts-builder';

describe('allowed-hosts builder', () => {
  const packageManager = any.word();

  it('should list the package-manager in the allowed list', () => {
    expect(buildAllowedHostsList({packageManager, registries: {}})).toEqual([packageManager]);
  });

  it('should allow additional registries when provided', () => {
    const registries = any.simpleObject();

    expect(buildAllowedHostsList({packageManager, registries}))
      .toEqual([packageManager, ...Object.values(registries)]);
  });

  it('should not list the package-manager if the provided registries override the official registry', () => {
    const registry = any.url();

    expect(buildAllowedHostsList({packageManager, registries: {registry}})).toEqual([registry]);
  });

  it('should not list the publish registry as an allowed installation registry', () => {
    const publishRegistry = any.url();

    expect(buildAllowedHostsList({packageManager, registries: {publish: publishRegistry}})).toEqual([packageManager]);
  });
});
