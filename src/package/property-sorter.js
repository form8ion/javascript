import sortProperties from 'sort-object-keys';

export default function (packageContents) {
  return sortProperties(
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
      'config',
      'dependencies',
      'devDependencies',
      'peerDependencies'
    ]
  );
}
