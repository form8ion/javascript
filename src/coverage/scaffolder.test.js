import {scaffold as scaffoldCodecov} from '@form8ion/codecov';
import {scaffold as scaffoldC8} from '@form8ion/c8';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import scaffold from './scaffolder.js';

vi.mock('@form8ion/codecov');
vi.mock('@form8ion/c8');

describe('coverage scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold coverage measurement and reporting', async () => {
    const vcs = any.simpleObject();
    const visibility = any.word();
    const projectRoot = any.string();
    const c8Results = any.simpleObject();
    const codecovResults = any.simpleObject();
    const pathWithinParent = any.string();
    when(scaffoldC8).calledWith({projectRoot}).thenResolve(c8Results);
    when(scaffoldCodecov).calledWith({vcs, visibility, pathWithinParent}).thenResolve(codecovResults);

    const results = await scaffold({vcs, visibility, projectRoot, pathWithinParent});

    expect(results).toEqual({...c8Results, ...codecovResults});
  });
});
