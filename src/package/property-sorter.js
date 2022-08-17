import sortProperties from '../../thirdparty-wrappers/sort-object-keys';

export default function (packageContents) {
  return sortProperties(
    packageContents,
    [
      'name',
      'description',
      'license',
      'version',
      'engines',
      'author',
      'repository',
      'bugs',
      'homepage',
      'keywords',
      'runkitExampleFilename',
      'exports',
      'main',
      'module',
      'files',
      'publishConfig',
      'sideEffects',
      'scripts',
      'dependencies',
      'devDependencies',
      'peerDependencies'
    ]
  );
}
