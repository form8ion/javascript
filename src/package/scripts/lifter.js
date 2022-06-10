import updateTestScript from './test-script-updater';

export default function ({existingScripts, scripts}) {
  return updateTestScript({...existingScripts, ...scripts});
}
