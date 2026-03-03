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

function getCategoryOrder(base) {
  if (base.startsWith('lint:')) return 0;
  if ('test:unit' === base) return 1;
  if ('test:integration' === base) return 2;
  if (base.startsWith('test:')) return 1;
  return 3;
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

  const categoryDiff = getCategoryOrder(aBase) - getCategoryOrder(bBase);
  if (0 !== categoryDiff) return 0 > categoryDiff ? -1 : 1;

  return a.localeCompare(b);
}
