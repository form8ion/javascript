import updateTestScript from './test-script-updater.js';
import sortScripts from './scripts-sorter.js';

export default function ({existingScripts, scripts}) {
  return {
    scripts: sortScripts(updateTestScript({...existingScripts, ...scripts})),
    dependencies: {
      javascript: {
        development: ['npm-run-all2'],
        remove: ['npm-run-all']
      }
    }
  };
}
