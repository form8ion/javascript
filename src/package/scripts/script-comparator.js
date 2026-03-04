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
  if ('test' === base) return 0;
  if (base.startsWith('lint:')) return 1;
  if (base.startsWith('test:unit')) return 2;
  if (base.startsWith('test:integration')) return 3;
  if (base.startsWith('test:')) return 2;

  return 4;
}

export default function compareScriptNames(a, b) {
  if (isPreScriptFor(a, b)) return -1;
  if (isPreScriptFor(b, a)) return 1;
  if (isPostScriptFor(a, b)) return 1;
  if (isPostScriptFor(b, a)) return -1;

  const aBase = getBaseScriptOf(a);
  const bBase = getBaseScriptOf(b);

  const categoryDiff = getCategoryOrder(aBase) - getCategoryOrder(bBase);
  if (0 !== categoryDiff) return 0 > categoryDiff ? -1 : 1;

  const baseCompare = aBase.localeCompare(bBase);
  if (0 !== baseCompare) return 0 > baseCompare ? -1 : 1;

  return a.localeCompare(b);
}
