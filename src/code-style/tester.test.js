import {test as testForEslint} from '@form8ion/eslint';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import testForCodeStyleTools from './tester.js';

vi.mock('@form8ion/eslint');

describe('code-style tester', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should determine if eslint is used by the project', async () => {
    const options = any.simpleObject();
    const eslintResult = any.boolean();
    when(testForEslint).calledWith(options).thenResolve(eslintResult);

    expect(await testForCodeStyleTools(options)).toEqual(eslintResult);
  });
});
