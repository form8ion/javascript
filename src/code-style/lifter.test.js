import {lift as liftEslint} from '@form8ion/eslint';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import liftCodeStyle from './lifter.js';

vi.mock('@form8ion/eslint');

describe('code-style lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the code-style tools', async () => {
    const options = any.simpleObject();
    const eslintResults = any.simpleObject();
    when(liftEslint).calledWith(options).mockResolvedValue(eslintResults);

    expect(await liftCodeStyle(options)).toEqual(eslintResults);
  });
});
