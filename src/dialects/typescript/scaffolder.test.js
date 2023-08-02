import {fileTypes, writeConfigFile} from '@form8ion/core';
import {projectTypes} from '@form8ion/javascript-core';

import {describe, vi, afterEach, it, expect} from 'vitest';
import any from '@travi/any';

import scaffoldTypescriptDialect from './scaffolder';

vi.mock('@form8ion/core');

describe('typescript dialect scaffolder', () => {
  const scope = `@${any.word()}`;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should define the eslint config', async () => {
    const {eslint: {configs}} = await scaffoldTypescriptDialect({config: {}});

    expect(configs).toEqual(['typescript']);
  });

  it('should extend the scoped package in the tsconfig', async () => {
    const projectRoot = any.string();

    await scaffoldTypescriptDialect({config: {scope}, projectRoot});

    expect(writeConfigFile).toHaveBeenCalledWith({
      path: projectRoot,
      name: 'tsconfig',
      format: fileTypes.JSON,
      config: {
        $schema: 'https://json.schemastore.org/tsconfig',
        extends: `${scope}/tsconfig`,
        compilerOptions: {rootDir: 'src'},
        include: ['src/**/*.ts']
      }
    });
  });

  it('should define package specific details when the project is a package', async () => {
    const projectRoot = any.string();

    await scaffoldTypescriptDialect({config: {scope}, projectType: projectTypes.PACKAGE, projectRoot});

    expect(writeConfigFile).toHaveBeenCalledWith({
      path: projectRoot,
      name: 'tsconfig',
      format: fileTypes.JSON,
      config: {
        $schema: 'https://json.schemastore.org/tsconfig',
        extends: `${scope}/tsconfig`,
        compilerOptions: {
          rootDir: 'src',
          outDir: 'lib',
          declaration: true
        },
        include: ['src/**/*.ts']
      }
    });
  });

  it('should include the testFilenamePattern as an `exclude` when provided', async () => {
    const projectRoot = any.string();
    const testFilenamePattern = any.string();

    await scaffoldTypescriptDialect({config: {scope}, projectRoot, testFilenamePattern});

    expect(writeConfigFile).toHaveBeenCalledWith({
      path: projectRoot,
      name: 'tsconfig',
      format: fileTypes.JSON,
      config: {
        $schema: 'https://json.schemastore.org/tsconfig',
        extends: `${scope}/tsconfig`,
        compilerOptions: {rootDir: 'src'},
        include: ['src/**/*.ts'],
        exclude: [testFilenamePattern]
      }
    });
  });

  it('should define dev dependencies', async () => {
    const {devDependencies} = await scaffoldTypescriptDialect({config: {scope}});

    expect(devDependencies).toEqual(['typescript', `${scope}/tsconfig`]);
  });

  it('should ignore files from version control', async () => {
    const {vcsIgnore: {files}} = await scaffoldTypescriptDialect({config: {}});

    expect(files).toEqual(['tsconfig.tsbuildinfo']);
  });
});
