import deepmerge from 'deepmerge';
import {lift as liftEslint} from '@form8ion/eslint';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {lift as liftRemark} from './remark/index.js';
import liftCodeStyle from './lifter.js';

vi.mock('@form8ion/eslint');
vi.mock('deepmerge');
vi.mock('./remark/index.js');

describe('code-style lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the code-style tools', async () => {
    const options = any.simpleObject();
    const eslintResults = any.simpleObject();
    const remarkResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(liftEslint).calledWith(options).mockResolvedValue(eslintResults);
    when(liftRemark).calledWith(options).mockResolvedValue(remarkResults);
    when(deepmerge.all).calledWith([eslintResults, remarkResults]).mockReturnValue(mergedResults);

    expect(await liftCodeStyle(options)).toEqual(mergedResults);
  });
});
