import {test as testForEslint} from '@form8ion/eslint';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {test as testForRemarkStyleTools} from './remark/index.js';
import testForCodeStyleTools from './tester.js';

vi.mock('@form8ion/eslint');
vi.mock('./remark/index.js');

describe('code-style tester', () => {
  const options = any.simpleObject();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` if eslint is used by the project', async () => {
    when(testForEslint).calledWith(options).mockResolvedValue(true);
    when(testForRemarkStyleTools).calledWith(options).mockResolvedValue(false);

    expect(await testForCodeStyleTools(options)).toBe(true);
  });

  it('should return `true` if remark is used by the project', async () => {
    when(testForEslint).calledWith(options).mockResolvedValue(false);
    when(testForRemarkStyleTools).calledWith(options).mockResolvedValue(true);

    expect(await testForCodeStyleTools(options)).toBe(true);
  });

  it('should return `false` if no code-style linters are detected', async () => {
    when(testForEslint).calledWith(options).mockResolvedValue(false);
    when(testForRemarkStyleTools).calledWith(options).mockResolvedValue(false);

    expect(await testForCodeStyleTools(options)).toBe(false);
  });
});
