function sortTestScript() {
  return -1;
}

function isPreScriptFor(a, b) {
  return a.startsWith('pre') && a.slice(3) === b;
}

export default function compareScriptNames(a, b) {
  if (isPreScriptFor(a, b)) {
    return -1;
  }

  if (isPreScriptFor(b, a)) {
    return 1;
  }

  if ('test' === a) {
    return sortTestScript(a, b);
  }

  if ('test' === b) {
    return -sortTestScript(b, a);
  }

  if (a.startsWith('lint:') && b.startsWith('test:')) {
    return -1;
  }

  if (b.startsWith('lint:') && a.startsWith('test:')) {
    return 1;
  }

  return 0;
}
