import any from '@travi/any';
import {when} from 'vitest-when';
import {describe, expect, it, vi} from 'vitest';

import updateTestScript from './test-script-updater.js';
import sortScripts from './scripts-sorter.js';
import liftScripts from './lifter.js';

vi.mock('./scripts-sorter.js');
vi.mock('./test-script-updater.js');

describe('package.json scripts lifter', () => {
  it('should merge the provided scripts with the existing scripts', () => {
    const existingScripts = any.simpleObject();
    const scripts = any.simpleObject();
    const updatedScripts = any.simpleObject();
    const sortedScripts = any.simpleObject();
    when(updateTestScript).calledWith({...existingScripts, ...scripts}).thenReturn(updatedScripts);
    when(sortScripts).calledWith(updatedScripts).thenReturn(sortedScripts);

    expect(liftScripts({existingScripts, scripts})).toEqual({
      scripts: sortedScripts,
      dependencies: {
        javascript: {
          development: ['npm-run-all2'],
          remove: ['npm-run-all']
        }
      }
    });
  });
});
