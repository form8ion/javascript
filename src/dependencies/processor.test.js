import {DEV_DEPENDENCY_TYPE, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';

import installDependencies from './installer.js';
import removeDependencies from './remover.js';
import processDependencies from './processor.js';

vi.mock('./installer.js');
vi.mock('./remover.js');

describe('dependencies processor', () => {
  const projectRoot = any.string();
  const packageManager = any.word();

  it('should process the provided dependency lists', async () => {
    const production = any.listOf(any.word);
    const development = any.listOf(any.word);
    const remove = any.listOf(any.word);

    await processDependencies({
      dependencies: {javascript: {production, development, remove}},
      projectRoot,
      packageManager
    });

    expect(installDependencies).toHaveBeenCalledWith(production, PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    expect(installDependencies).toHaveBeenCalledWith(development, DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
    expect(removeDependencies).toHaveBeenCalledWith({packageManager, dependencies: remove});
  });

  it('should process as empty lists when dependencies are not provided', async () => {
    await processDependencies({projectRoot, packageManager});

    expect(installDependencies).toHaveBeenCalledWith([], PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    expect(installDependencies).toHaveBeenCalledWith([], DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
  });

  it('should process as empty lists when javascript dependencies are not provided', async () => {
    await processDependencies({projectRoot, packageManager, dependencies: {}});

    expect(installDependencies).toHaveBeenCalledWith([], PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    expect(installDependencies).toHaveBeenCalledWith([], DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
  });

  it('should process as empty lists when dependency types are not provided', async () => {
    await processDependencies({projectRoot, packageManager, dependencies: {javascript: {}}});

    expect(installDependencies).toHaveBeenCalledWith([], PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
    expect(installDependencies).toHaveBeenCalledWith([], DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
    expect(removeDependencies).toHaveBeenCalledWith({packageManager, dependencies: []});
  });

  it('should prevent an installation error from bubbling', async () => {
    installDependencies.mockRejectedValue(new Error());

    await expect(() => processDependencies({dependencies: {javascript: {}}})).not.toThrowError();
  });

  it('should throw an error if dependencies is defined as an array rather than an object', async () => {
    const dependencies = any.listOf(any.word);

    await expect(() => processDependencies({dependencies}))
      .rejects.toThrowError(`Expected dependencies to be an object. Instead received: ${dependencies}`);
  });

  it('should throw an error if devDependencies is defined as an array', async () => {
    const devDependencies = any.listOf(any.word);

    await expect(() => processDependencies({devDependencies})).rejects.toThrowError(
      `devDependencies provided as: ${devDependencies}. Instead, provide under dependencies.javascript.development`
    );
  });
});
