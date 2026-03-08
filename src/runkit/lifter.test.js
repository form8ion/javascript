import {describe, it, vi, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import removeRunkit from './remover.js';
import liftRunkit from './lifter.js';

vi.mock('./remover.js');

describe('runkit lifter', () => {
  it('should remove runkit', async () => {
    const removalResults = any.simpleObject();
    when(removeRunkit).calledWith().thenResolve(removalResults);

    expect(await liftRunkit()).toEqual(removalResults);
  });
});
