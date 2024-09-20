import {writePackageJson} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as buildPackageDetails from './details.js';
import buildPackageName from './package-name.js';
import {scaffold} from './index.js';

vi.mock('@form8ion/javascript-core');
vi.mock('./package-name.js');
vi.mock('./details.js');

describe('package scaffolder', () => {
  it('should create the package file', async () => {
    const projectName = any.string();
    const packageName = any.string();
    const scope = any.word();
    const packageDetails = any.simpleObject();
    const projectRoot = any.string();
    const dialect = any.word();
    const license = any.string();
    const author = any.simpleObject();
    const description = any.sentence();
    when(buildPackageName).calledWith(projectName, scope).mockReturnValue(packageName);
    when(buildPackageDetails.default).calledWith({
      packageName,
      dialect,
      license,
      author,
      description
    }).mockResolvedValue(packageDetails);

    expect(await scaffold({
      projectRoot,
      projectName,
      scope,
      dialect,
      license,
      author,
      description
    })).toEqual({packageName});
    expect(writePackageJson).toHaveBeenCalledWith({projectRoot, config: packageDetails});
  });
});
