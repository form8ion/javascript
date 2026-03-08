import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import scaffoldRunkit from './scaffolder.js';

vi.mock('@form8ion/javascript-core');

describe('runkit scaffolder', () => {
  it('should scaffold runkit details', async () => {
    const projectRoot = any.string();

    scaffoldRunkit({projectRoot, visibility: 'Public'});

    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {runkitExampleFilename: './example.js'}
    });
  });

  it('should not scaffold runkit details if the project is not public', async () => {
    scaffoldRunkit({visibility: any.word()});

    expect(mergeIntoExistingPackageJson).not.toHaveBeenCalledWith({runkitExampleFilename: './example.js'});
  });
});
