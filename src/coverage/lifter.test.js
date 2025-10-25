import deepmerge from 'deepmerge';
import {lift as liftCodecov} from '@form8ion/codecov';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import testForNyc from './nyc/tester.js';
import removeNyc from './nyc/remover.js';
import scaffoldC8 from './c8/scaffolder.js';
import {lift} from './lifter.js';

vi.mock('deepmerge');
vi.mock('@form8ion/codecov');
vi.mock('./nyc/tester');
vi.mock('./nyc/remover');
vi.mock('./c8/scaffolder');

describe('coverage lifter', () => {
  const projectRoot = any.string();
  const vcs = any.simpleObject();
  const c8Results = any.simpleObject();
  const codecovResults = any.simpleObject();
  const packageManager = any.word();

  it('should replace `nyc` with `c8` if nyc config exists', async () => {
    const nycResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(scaffoldC8).calledWith({projectRoot}).thenResolve(c8Results);
    when(testForNyc).calledWith({projectRoot}).thenResolve(true);
    when(removeNyc).calledWith({projectRoot}).thenResolve(nycResults);
    when(liftCodecov).calledWith({projectRoot, packageManager, vcs}).thenResolve(codecovResults);
    when(deepmerge.all).calledWith([
      c8Results,
      nycResults,
      codecovResults,
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
    when(liftCodecov).calledWith({projectRoot, packageManager}).thenResolve(codecovResults);

    expect(await lift({projectRoot, packageManager})).toEqual(codecovResults);

    expect(scaffoldC8).not.toHaveBeenCalled();
  });
});
