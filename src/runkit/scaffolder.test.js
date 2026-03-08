import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {scaffold as scaffoldBadge} from './badge/index.js';
import scaffoldRunkit from './scaffolder.js';

vi.mock('@form8ion/javascript-core');
vi.mock('./badge/index.js');

describe('runkit scaffolder', () => {
  it('should scaffold runkit details', async () => {
    const projectRoot = any.string();
    const visibility = 'Public';
    const badgeResults = any.simpleObject();
    const packageName = any.word();
    when(scaffoldBadge).calledWith({packageName}).thenReturn(badgeResults);

    expect(await scaffoldRunkit({projectRoot, packageName, visibility})).toEqual(badgeResults);

    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {runkitExampleFilename: './example.js'}
    });
  });

  it('should not scaffold runkit details if the project is not public', async () => {
    await scaffoldRunkit({visibility: any.word()});

    expect(mergeIntoExistingPackageJson).not.toHaveBeenCalled();
    expect(scaffoldBadge).not.toHaveBeenCalled();
  });
});
