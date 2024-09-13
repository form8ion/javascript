import {DEV_DEPENDENCY_TYPE, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';

import installDependencies from './installer.js';
import processDependencies from './processor.js';

vi.mock('./installer.js');

describe('dependencies processor', () => {
  const projectRoot = any.string();
  const packageManager = any.word();

  it('should process the provided dependency lists', async () => {
    const dependencies = any.listOf(any.word);
    const devDependencies = any.listOf(any.word);

    await processDependencies({dependencies, devDependencies, projectRoot, packageManager});

    expect(installDependencies).toHaveBeenCalledWith(dependencies, PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    expect(installDependencies).toHaveBeenCalledWith(devDependencies, DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
  });

  it('should process as empty lists when dependencies are not provided', async () => {
    await processDependencies({projectRoot, packageManager});

    expect(installDependencies).toHaveBeenCalledWith([], PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    expect(installDependencies).toHaveBeenCalledWith([], DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
  });

  it('should prevent an installation error from bubbling', async () => {
    installDependencies.mockRejectedValue(new Error());

    await expect(() => processDependencies({})).not.toThrowError();
  });
});
