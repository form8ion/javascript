function sortTestScript() {
  return -1;
}

function isRelatedScript(a, b, prefix) {
  return a.startsWith(prefix) && a.slice(prefix.length) === b;
}

function isPreScriptFor(a, b) {
  return isRelatedScript(a, b, 'pre');
}

function isPostScriptFor(a, b) {
  return isRelatedScript(a, b, 'post');
}

function getBaseScriptOf(script) {
  return script.replace(/^(?:pre|post)/, '');
}

export default function compareScriptNames(a, b) {
  if (isPreScriptFor(a, b)) return -1;
  if (isPreScriptFor(b, a)) return 1;
  if (isPostScriptFor(a, b)) return 1;
  if (isPostScriptFor(b, a)) return -1;

  if ('test' === a) {
    return sortTestScript(a, b);
  }

  if ('test' === b) {
    return -sortTestScript(b, a);
  }

  const aBase = getBaseScriptOf(a);
  const bBase = getBaseScriptOf(b);

  if (aBase.startsWith('lint:') && bBase.startsWith('test:')) {
    return -1;
  }

  if (bBase.startsWith('lint:') && aBase.startsWith('test:')) {
    return 1;
  }

  if (aBase.startsWith('lint:')) {
    return -1;
  }

  if (bBase.startsWith('lint:')) {
    return 1;
  }

  return 0;
}
