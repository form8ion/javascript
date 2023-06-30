import {writePackageJson} from '@form8ion/javascript-core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as buildPackageDetails from './details';
import {scaffold} from './index';

vi.mock('@form8ion/javascript-core');
vi.mock('./details');

describe('package scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create the package file', async () => {
    const packageName = any.string();
    const homepage = any.url();
    const packageDetails = {...any.simpleObject(), homepage};
    const projectRoot = any.string();
    const projectType = any.word();
    const dialect = any.word();
    const license = any.string();
    const vcs = any.simpleObject();
    const author = any.simpleObject();
    const description = any.sentence();
    const pathWithinParent = any.string();
    when(buildPackageDetails.default).calledWith({
      packageName,
      projectType,
      dialect,
      license,
      vcs,
      author,
      description,
      pathWithinParent
    }).mockResolvedValue(packageDetails);

    expect(await scaffold({
      projectRoot,
      projectType,
      dialect,
      packageName,
      license,
      vcs,
      author,
      description,
      pathWithinParent
    })).toEqual({homepage});
    expect(writePackageJson).toHaveBeenCalledWith({projectRoot, config: packageDetails});
  });
});
