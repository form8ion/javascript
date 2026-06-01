import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import scaffoldMonorepo from './scaffolder.js';

vi.mock('@form8ion/javascript-core');

describe('monorepo project-type scaffolder', () => {
  const projectRoot = any.string();
  const logger = {info: () => undefined};

  it('should scaffold the monorepo specific project details', async () => {
    expect(await scaffoldMonorepo({projectRoot}, {logger})).toEqual({
      nextSteps: [{
        summary: 'Add packages to your new monorepo',
        description: 'Leverage [@form8ion/add-package-to-monorepo](https://npm.im/@form8ion/add-package-to-monorepo)'
          + ' to scaffold new packages into your new monorepo'
      }]
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({projectRoot, config: {private: true}});
  });
});
