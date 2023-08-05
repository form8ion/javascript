import deepmerge from 'deepmerge';
import {lift as liftCodecov} from '@form8ion/codecov';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import testForNyc from './nyc/tester';
import removeNyc from './nyc/remover';
import scaffoldC8 from './c8/scaffolder';
import {lift} from './lifter';

vi.mock('deepmerge');
vi.mock('@form8ion/codecov');
vi.mock('./nyc/tester');
vi.mock('./nyc/remover');
vi.mock('./c8/scaffolder');

describe('coverage lifter', () => {
  const projectRoot = any.string();
  const c8Results = any.simpleObject();
  const codecovResults = any.simpleObject();
  const packageManager = any.word();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should replace `nyc` with `c8` if nyc config exists', async () => {
    const mergedResults = any.simpleObject();
    when(scaffoldC8).calledWith({projectRoot}).mockResolvedValue(c8Results);
    when(testForNyc).calledWith({projectRoot}).mockResolvedValue(true);
    when(liftCodecov).calledWith({projectRoot, packageManager}).mockResolvedValue(codecovResults);
    when(deepmerge.all).calledWith([
      c8Results,
      codecovResults,
      {
        scripts: {'test:unit': 'cross-env NODE_ENV=test c8 run-s test:unit:base'},
        nextSteps: [{
          summary: 'Remove use of `@istanbuljs/nyc-config-babel` from your babel config, if present,'
            + ' after the migration away from `nyc`'
        }]
      }
    ]).mockReturnValue(mergedResults);

    expect(await lift({projectRoot, packageManager})).toEqual(mergedResults);

    expect(removeNyc).toHaveBeenCalledWith({projectRoot, packageManager});
  });

  it('should not replace `nyc` with `c8` if nyc config does not exist', async () => {
    when(scaffoldC8).calledWith({projectRoot}).mockResolvedValue(c8Results);
    when(testForNyc).calledWith({projectRoot}).mockResolvedValue(false);
    when(liftCodecov).calledWith({projectRoot, packageManager}).mockResolvedValue(codecovResults);

    expect(await lift({projectRoot, packageManager})).toEqual(codecovResults);

    expect(scaffoldC8).not.toHaveBeenCalled();
  });
});
