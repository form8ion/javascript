import sortProperties from '../../thirdparty-wrappers/sort-object-keys';

export default function (packageContents) {
  return sortProperties(
    packageContents,
    [
      'name',
      'description',
      'license',
      'version',
      'type',
      'engines',
      'author',
      'repository',
      'bugs',
      'homepage',
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
