import {scaffold as scaffoldC8} from '@form8ion/c8';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import scaffold from './scaffolder.js';

vi.mock('@form8ion/codecov');
vi.mock('@form8ion/c8');

describe('coverage scaffolder', () => {
  it('should scaffold coverage measurement and reporting', async () => {
    const projectRoot = any.string();
    const c8Results = any.simpleObject();
    when(scaffoldC8).calledWith({projectRoot}).thenResolve(c8Results);

    const results = await scaffold({projectRoot});

    expect(results).toEqual(c8Results);
  });
});
