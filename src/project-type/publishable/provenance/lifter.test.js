import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import enhanceSlsa from './slsa';
import lift from './lifter';

vi.mock('@form8ion/javascript-core');
vi.mock('./slsa');

describe('provenance lifter', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should configure provenance for a public package published to the official registry', async () => {
    const packageDetails = {...any.simpleObject(), publishConfig: {access: 'public'}};
    const slsaResults = any.simpleObject();
    when(enhanceSlsa).calledWith({provenance: true}).mockReturnValue(slsaResults);

    expect(await lift({packageDetails, projectRoot})).toEqual(slsaResults);
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {publishConfig: {provenance: true}}
    });
  });

  it('should not configure provenance for a restricted package', async () => {
    const packageDetails = {...any.simpleObject(), publishConfig: {access: 'restricted'}};

    expect(await lift({packageDetails, projectRoot})).toEqual({});
    expect(enhanceSlsa).not.toHaveBeenCalled();
    expect(mergeIntoExistingPackageJson).not.toHaveBeenCalled();
  });
});
