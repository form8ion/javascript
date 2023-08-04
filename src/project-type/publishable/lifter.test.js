import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import enhanceSlsa from './slsa';
import lift from './lifter';

vi.mock('deepmerge');
vi.mock('@form8ion/javascript-core');
vi.mock('./slsa');

describe('publishable project-type lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the details of the package project', async () => {
    const projectRoot = any.string();
    const packageDetails = any.simpleObject();
    const slsaResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(enhanceSlsa).calledWith({packageDetails}).mockReturnValue(slsaResults);
    when(deepmerge).calledWith(
      slsaResults,
      {scripts: {'lint:publish': 'publint --strict'}, devDependencies: ['publint']}
    ).mockReturnValue(mergedResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(mergedResults);

    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {publishConfig: {provenance: true}}
    });
  });
});
