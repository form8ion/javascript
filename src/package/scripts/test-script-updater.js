function projectWillBeTested(scripts) {
  return Object.keys(scripts).find(scriptName => scriptName.startsWith('test:'));
}

function projectShouldBeBuiltForVerification(scripts) {
  return 'run-s build' === scripts['pregenerate:md'];
}

export default function (scripts) {
  return {
    ...scripts,
    test: `npm-run-all --print-label${
      projectShouldBeBuiltForVerification(scripts) ? ' build' : ''
    } --parallel lint:*${
      projectWillBeTested(scripts) ? ' --parallel test:*' : ''
    }`
  };
}
