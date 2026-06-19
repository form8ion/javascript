export default function scaffoldVcsHostDetails(vcs, pathWithinParent) {
  return vcs && {
    repository: {
      type: 'git',
      url: `git+https://${vcs.host}/${vcs.owner}/${vcs.name}.git`,
      ...pathWithinParent && {directory: pathWithinParent}
    },
    bugs: `https://${vcs.host}/${vcs.owner}/${vcs.name}/issues`
  };
}
