import any from '@travi/any';
import {when} from 'jest-when';
import {describe, expect, it, vi} from 'vitest';

import updateTestScript from './test-script-updater.js';
import liftScripts from './lifter.js';

vi.mock('./test-script-updater.js');

describe('package.json scripts lifter', () => {
  it('should merge the provided scripts with the existing scripts', () => {
    const existingScripts = any.simpleObject();
    const scripts = any.simpleObject();
    const updatedScripts = any.simpleObject();
    when(updateTestScript).calledWith({...existingScripts, ...scripts}).mockReturnValue(updatedScripts);

    expect(liftScripts({existingScripts, scripts})).toEqual({
      scripts: updatedScripts,
      dependencies: {
        javascript: {
          development: ['npm-run-all2'],
          remove: ['npm-run-all']
        }
      }
    });
  });
});
