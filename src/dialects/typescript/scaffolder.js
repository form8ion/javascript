import {fileTypes, writeConfigFile} from '@form8ion/core';
import {projectTypes} from '@form8ion/javascript-core';

export default async function ({config, projectType, projectRoot, testFilenamePattern}) {
  const eslintConfigs = ['typescript'];
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
    eslint: {configs: eslintConfigs},
    eslintConfigs,
    devDependencies: ['typescript', shareableTsConfigPackage],
    vcsIgnore: {files: ['tsconfig.tsbuildinfo']}
  };
}
