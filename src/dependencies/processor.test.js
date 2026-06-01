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
  const logger = {info: () => undefined, error: () => undefined};

  it('should process the provided dependency lists', async () => {
    const production = any.listOf(any.word);
    const development = any.listOf(any.word);
    const remove = any.listOf(any.word);

    await processDependencies({
      dependencies: {javascript: {production, development, remove}},
      projectRoot,
      packageManager
    }, {logger});

    expect(installDependencies).toHaveBeenCalledWith(
      production,
      PROD_DEPENDENCY_TYPE,
      projectRoot,
      packageManager,
      {logger}
    );
    expect(installDependencies).toHaveBeenCalledWith(
      development,
      DEV_DEPENDENCY_TYPE,
      projectRoot,
      packageManager,
      {logger}
    );
    expect(removeDependencies).toHaveBeenCalledWith({packageManager, dependencies: remove}, {logger});
  });

  it('should process as empty lists when dependencies are not provided', async () => {
    await processDependencies({projectRoot, packageManager}, {logger});

    expect(installDependencies).toHaveBeenCalledWith([], PROD_DEPENDENCY_TYPE, projectRoot, packageManager, {logger});
    expect(installDependencies).toHaveBeenCalledWith([], DEV_DEPENDENCY_TYPE, projectRoot, packageManager, {logger});
  });

  it('should process as empty lists when javascript dependencies are not provided', async () => {
    await processDependencies({projectRoot, packageManager, dependencies: {}}, {logger});

    expect(installDependencies).toHaveBeenCalledWith([], PROD_DEPENDENCY_TYPE, projectRoot, packageManager, {logger});
    expect(installDependencies).toHaveBeenCalledWith([], DEV_DEPENDENCY_TYPE, projectRoot, packageManager, {logger});
  });

  it('should process as empty lists when dependency types are not provided', async () => {
    await processDependencies({projectRoot, packageManager, dependencies: {javascript: {}}}, {logger});

    expect(installDependencies).toHaveBeenCalledWith([], PROD_DEPENDENCY_TYPE, projectRoot, packageManager, {logger});
    expect(installDependencies).toHaveBeenCalledWith([], DEV_DEPENDENCY_TYPE, projectRoot, packageManager, {logger});
    expect(removeDependencies).toHaveBeenCalledWith({packageManager, dependencies: []}, {logger});
  });

  it('should prevent an installation error from bubbling', async () => {
    installDependencies.mockRejectedValue(new Error());

    expect(() => processDependencies({dependencies: {javascript: {}}}, {logger})).not.toThrow();
  });

  it('should throw an error if dependencies is defined as an array rather than an object', async () => {
    const dependencies = any.listOf(any.word);

    await expect(() => processDependencies({dependencies}, {logger}))
      .rejects.toThrow(`Expected dependencies to be an object. Instead received: ${dependencies}`);
  });

  it('should throw an error if devDependencies is defined as an array', async () => {
    const devDependencies = any.listOf(any.word);

    await expect(() => processDependencies({devDependencies}, {logger})).rejects.toThrowError(
      `devDependencies provided as: ${devDependencies}. Instead, provide under dependencies.javascript.development`
    );
  });
});
