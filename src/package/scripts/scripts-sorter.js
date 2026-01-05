import sortObjectKeys from 'sort-object-keys';

import compareScriptNames from './script-comparator.js';

export default function sortScripts(scripts) {
  return sortObjectKeys(scripts, compareScriptNames);
}
