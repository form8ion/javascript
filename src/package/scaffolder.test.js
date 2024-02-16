import {writePackageJson} from '@form8ion/javascript-core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as buildPackageDetails from './details.js';
import {scaffold} from './index.js';

vi.mock('@form8ion/javascript-core');
vi.mock('./details');

describe('package scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create the package file', async () => {
    const packageName = any.string();
    const packageDetails = any.simpleObject();
    const projectRoot = any.string();
    const dialect = any.word();
    const license = any.string();
    const author = any.simpleObject();
    const description = any.sentence();
    when(buildPackageDetails.default).calledWith({
      packageName,
      dialect,
      license,
      author,
      description
    }).mockResolvedValue(packageDetails);

    expect(await scaffold({
      projectRoot,
      dialect,
      packageName,
      license,
      author,
      description
    })).toEqual({});
    expect(writePackageJson).toHaveBeenCalledWith({projectRoot, config: packageDetails});
  });
});
