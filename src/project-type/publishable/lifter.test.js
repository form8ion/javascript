import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import defineBadges from './badges.js';
import {lift as liftProvenance} from './provenance/index.js';
import lift from './lifter.js';

vi.mock('deepmerge');
vi.mock('@form8ion/javascript-core');
vi.mock('./provenance');
vi.mock('./badges');

describe('publishable project-type lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the details of the package project', async () => {
    const projectRoot = any.string();
    const packageName = any.word();
    const packageAccessLevel = any.word();
    const packageDetails = {...any.simpleObject(), name: packageName, publishConfig: {access: packageAccessLevel}};
    const provenanceResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    const badgesResults = any.simpleObject();
    const homepage = `https://npm.im/${packageName}`;
    when(liftProvenance).calledWith({packageDetails, projectRoot}).mockResolvedValue(provenanceResults);
    when(defineBadges).calledWith(packageName, packageAccessLevel).mockReturnValue(badgesResults);
    when(deepmerge).calledWith(
      provenanceResults,
      {
        scripts: {'lint:publish': 'publint --strict'},
        dependencies: {javascript: {development: ['publint']}},
        badges: badgesResults,
        homepage
      }
    ).mockReturnValue(mergedResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(mergedResults);
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({projectRoot, config: {homepage}});
  });
});
