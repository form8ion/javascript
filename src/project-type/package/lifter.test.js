import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import lift from './lifter';

vi.mock('@form8ion/javascript-core');

describe('package project-type lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the details of the package project', async () => {
    const projectRoot = any.string();

    expect(await lift({projectRoot})).toEqual({
      scripts: {'lint:publish': 'publint'},
      devDependencies: ['publint']
    });

    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {publishConfig: {provenance: true}}
    });
  });
});
