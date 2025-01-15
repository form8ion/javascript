import {packageManagers} from '@form8ion/javascript-core';

import {describe, it, vi, expect} from 'vitest';
import any from '@travi/any';

import {scaffold as scaffoldNpm} from './npm/index.js';
import {scaffold as scaffoldYarn} from './yarn/index.js';
import scaffoldPackageManager from './scaffolder.js';

vi.mock('./npm/index.js');
vi.mock('./yarn/index.js');

describe('package manager scaffolder', () => {
  const projectRoot = any.string();

  it('should scaffold npm when npm is the chosen packageManager', async () => {
    await scaffoldPackageManager({projectRoot, packageManager: packageManagers.NPM});

    expect(scaffoldNpm).toHaveBeenCalledWith({projectRoot});
  });

  it('should scaffold yarn when yarn is the chosen packageManager', async () => {
    await scaffoldPackageManager({projectRoot, packageManager: packageManagers.YARN});

    expect(scaffoldYarn).toHaveBeenCalledWith({projectRoot});
  });
});
