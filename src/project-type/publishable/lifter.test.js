import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import resolveRegistry from './registry-resolver.js';
import defineBadges from './badges.js';
import {lift as liftProvenance} from './provenance/index.js';
import lift from './lifter.js';

vi.mock('deepmerge');
vi.mock('@form8ion/javascript-core');
vi.mock('./provenance');
vi.mock('./badges');
vi.mock('./registry-resolver.js');

describe('publishable project-type lifter', () => {
  it('should lift the details of the package project', async () => {
    const projectRoot = any.string();
    const packageName = any.word();
    const packageAccessLevel = any.word();
    const registries = any.simpleObject();
    const customRegistry = any.url();
    const packageDetails = {...any.simpleObject(), name: packageName, publishConfig: {access: packageAccessLevel}};
    const provenanceResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    const badgesResults = any.simpleObject();
    const homepage = `https://npm.im/${packageName}`;
    when(resolveRegistry).calledWith(packageName, registries).thenReturn(customRegistry);
    when(liftProvenance).calledWith({packageDetails, projectRoot, customRegistry}).thenResolve(provenanceResults);
    when(defineBadges)
      .calledWith({packageName, accessLevel: packageAccessLevel, customRegistry})
      .thenReturn(badgesResults);
    when(deepmerge).calledWith(
      provenanceResults,
      {
        scripts: {'lint:publish': 'publint --strict'},
        dependencies: {javascript: {development: ['publint']}},
        badges: badgesResults,
        homepage
      }
    ).thenReturn(mergedResults);

    expect(await lift({projectRoot, packageDetails, configs: {registries}})).toEqual(mergedResults);
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({projectRoot, config: {homepage}});
  });
});
