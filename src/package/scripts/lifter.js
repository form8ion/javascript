import updateTestScript from './test-script-updater.js';

export default function ({existingScripts, scripts}) {
  return updateTestScript({...existingScripts, ...scripts});
}
