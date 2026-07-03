import deepmerge from 'deepmerge';
import {scaffold as scaffoldC8} from '@form8ion/c8';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import testForNyc from './nyc/tester.js';
import removeNyc from './nyc/remover.js';
import {lift} from './lifter.js';

vi.mock('deepmerge');
vi.mock('@form8ion/codecov');
vi.mock('@form8ion/c8');
vi.mock('./nyc/tester');
vi.mock('./nyc/remover');

describe('coverage lifter', () => {
  const projectRoot = any.string();
  const vcs = any.simpleObject();
  const c8Results = any.simpleObject();
  const packageManager = any.word();

  it('should replace `nyc` with `c8` if nyc config exists', async () => {
    const nycResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(scaffoldC8).calledWith({projectRoot}).thenResolve(c8Results);
    when(testForNyc).calledWith({projectRoot}).thenResolve(true);
    when(removeNyc).calledWith({projectRoot}).thenResolve(nycResults);
    when(deepmerge.all).calledWith([
      c8Results,
      nycResults,
      {
        scripts: {'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base'},
        nextSteps: [{
          summary: 'Remove use of `@istanbuljs/nyc-config-babel` from your babel config, if present,'
            + ' after the migration away from `nyc`'
        }]
      }
    ]).thenReturn(mergedResults);

    expect(await lift({projectRoot, packageManager, vcs})).toEqual(mergedResults);
  });

  it('should not replace `nyc` with `c8` if nyc config does not exist', async () => {
    when(scaffoldC8).calledWith({projectRoot}).thenResolve(c8Results);
    when(testForNyc).calledWith({projectRoot}).thenResolve(false);

    expect(await lift({projectRoot})).toEqual({});

    expect(scaffoldC8).not.toHaveBeenCalled();
  });
});
