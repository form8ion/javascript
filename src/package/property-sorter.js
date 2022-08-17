import sortProperties from '../../thirdparty-wrappers/sort-object-keys';

export default function (packageContents) {
  return sortProperties(
    packageContents,
    ['name', 'keywords', 'engines', 'scripts', 'dependencies', 'devDependencies', 'peerDependencies']
  );
}
