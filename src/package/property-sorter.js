import sortObjectKeys from 'sort-object-keys';

export default function sortProperties(packageContents) {
  return sortObjectKeys(
    packageContents,
    [
      'name',
      'description',
      'license',
      'version',
      'private',
      'type',
      'engines',
      'author',
      'contributors',
      'repository',
      'bugs',
      'homepage',
      'funding',
      'keywords',
      'runkitExampleFilename',
      'exports',
      'bin',
      'main',
      'module',
      'types',
      'sideEffects',
      'scripts',
      'files',
      'publishConfig',
      'packageManager',
      'config',
      'dependencies',
      'devDependencies',
      'peerDependencies'
    ]
  );
}
