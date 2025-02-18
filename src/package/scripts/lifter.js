import updateTestScript from './test-script-updater.js';

export default function ({existingScripts, scripts}) {
  return {
    scripts: updateTestScript({...existingScripts, ...scripts}),
    dependencies: {
      javascript: {
        development: ['npm-run-all2'],
        remove: ['npm-run-all']
      }
    }
  };
}
