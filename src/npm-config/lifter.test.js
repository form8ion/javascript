import {loadNpmrc, writeNpmrc} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import liftNpmConfig from './lifter.js';

vi.mock('@form8ion/javascript-core');

describe('npm config lifter', () => {
  it('should remove `provenance` and `engines-strict` properties from the config', async () => {
    const projectRoot = any.string();
    const desiredProperties = any.simpleObject();
    when(loadNpmrc)
      .calledWith({projectRoot})
      .thenResolve({...desiredProperties, provenance: true, 'engines-strict': true});

    expect(await liftNpmConfig({projectRoot})).toEqual({});
    expect(writeNpmrc).toHaveBeenCalledWith({projectRoot, config: desiredProperties});
  });
});
