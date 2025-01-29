import {fileTypes, writeConfigFile} from '@form8ion/core';
import {projectTypes} from '@form8ion/javascript-core';

export default async function ({config, projectType, projectRoot, testFilenamePattern}) {
  const shareableTsConfigPackage = `${config.scope}/tsconfig`;

  await writeConfigFile({
    path: projectRoot,
    name: 'tsconfig',
    format: fileTypes.JSON,
    config: {
      $schema: 'https://json.schemastore.org/tsconfig',
      extends: shareableTsConfigPackage,
      compilerOptions: {
        rootDir: 'src',
        ...projectTypes.PACKAGE === projectType && {
          outDir: 'lib',
          declaration: true
        }
      },
      include: ['src/**/*.ts'],
      ...testFilenamePattern && {exclude: [testFilenamePattern]}
    }
  });

  return {
    eslint: {configs: ['typescript']},
    dependencies: {javascript: {development: ['typescript', shareableTsConfigPackage]}},
    vcsIgnore: {files: ['tsconfig.tsbuildinfo']}
  };
}
