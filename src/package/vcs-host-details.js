export default function (vcs, pathWithinParent) {
  return vcs && 'github' === vcs.host && {
    repository: pathWithinParent
      ? {
        type: 'git',
        url: `https://github.com/${vcs.owner}/${vcs.name}.git`,
        directory: pathWithinParent
      }
      : `${vcs.owner}/${vcs.name}`,
    bugs: `https://github.com/${vcs.owner}/${vcs.name}/issues`
  };
}
