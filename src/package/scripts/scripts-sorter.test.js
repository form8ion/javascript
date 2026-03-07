import sortObjectKeys from 'sort-object-keys';

import {it, describe, expect, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import compareScriptNames from './script-comparator.js';
import sortScripts from './scripts-sorter.js';

vi.mock('sort-object-keys');

describe('npm scripts sorter', () => {
  it('should sort the scripts based on the defined order', async () => {
    const unsortedScripts = any.simpleObject();
    const sortedScripts = any.simpleObject();
    when(sortObjectKeys).calledWith(unsortedScripts, compareScriptNames).thenReturn(sortedScripts);

    expect(sortScripts(unsortedScripts)).toEqual(sortedScripts);
  });
});
