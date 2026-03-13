export default function buildIgnoreLists(vcsIgnoreLists = {}) {
  return {
    files: vcsIgnoreLists.files || [],
    directories: ['/node_modules/', ...vcsIgnoreLists.directories || []]
  };
}
