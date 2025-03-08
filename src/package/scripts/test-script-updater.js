function projectWillBeTested(scripts) {
  return Object.keys(scripts).find(scriptName => scriptName.startsWith('test:'));
}

function projectShouldBeBuiltForVerification(scripts) {
  return 'run-s build' === scripts['pregenerate:md'];
}

export default function (scripts) {
  return {
    ...scripts,
    ...projectShouldBeBuiltForVerification(scripts) && {pretest: 'run-s build'},
    test: `npm-run-all --print-label --parallel lint:*${projectWillBeTested(scripts) ? ' --parallel test:*' : ''}`
  };
}
