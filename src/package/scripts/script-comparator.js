function isRelatedScript(a, b, prefix) {
  return a.startsWith(prefix) && a.slice(prefix.length) === b;
}

function isPreScriptFor(a, b) {
  return isRelatedScript(a, b, 'pre');
}

function isPostScriptFor(a, b) {
  return isRelatedScript(a, b, 'post');
}

function stripPrefix(script) {
  if (script.startsWith('pre')) return script.slice(3);
  if (script.startsWith('post')) return script.slice(4);
  return script;
}

function getCategoryOrder(script) {
  const base = stripPrefix(script);
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

  const categoryDiff = getCategoryOrder(a) - getCategoryOrder(b);
  if (0 !== categoryDiff) return 0 > categoryDiff ? -1 : 1;

  const aStripped = stripPrefix(a);
  const bStripped = stripPrefix(b);

  const aKey = aStripped !== a ? aStripped : a;
  const bKey = bStripped !== b ? bStripped : b;

  return aKey.localeCompare(bKey);
}
