import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import read from './reader.js';
import write from './writer.js';
import liftNpmConfig from './lifter.js';

vi.mock('./reader.js');
vi.mock('./writer.js');

describe('npm config lifter', () => {
  it('should remove `provenance` and `engines-strict` properties from the config', async () => {
    const projectRoot = any.string();
    const desiredProperties = any.simpleObject();
    when(read)
      .calledWith({projectRoot})
      .thenResolve({...desiredProperties, provenance: true, 'engines-strict': true});

    expect(await liftNpmConfig({projectRoot})).toEqual({});
    expect(write).toHaveBeenCalledWith({projectRoot, config: desiredProperties});
  });
});
