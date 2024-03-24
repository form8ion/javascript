import sortObjectKeys from 'sort-object-keys';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import sortProperties from './property-sorter.js';

vi.mock('sort-object-keys');

describe('package.json property sorter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should sort the package properties based on the defined order', () => {
    const packageContents = any.simpleObject();
    const sortedPackageContents = any.simpleObject();
    when(sortObjectKeys).calledWith(
      packageContents,
      [
        'name',
        'description',
        'license',
        'version',
        'private',
        'type',
        'engines',
        'author',
        'contributors',
        'repository',
        'bugs',
        'homepage',
        'funding',
        'keywords',
        'runkitExampleFilename',
        'exports',
        'bin',
        'main',
        'module',
        'types',
        'sideEffects',
        'scripts',
        'files',
        'publishConfig',
        'packageManager',
        'config',
        'dependencies',
        'devDependencies',
        'peerDependencies'
      ]
    ).mockReturnValue(sortedPackageContents);

    expect(sortProperties(packageContents)).toEqual(sortedPackageContents);
  });
});
