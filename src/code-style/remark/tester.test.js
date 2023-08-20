import {fileExists} from '@form8ion/core';

import {describe, vi, it, expect, afterEach, beforeEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import testForRemark from './tester';

vi.mock('@form8ion/core');

describe('remark predicate', () => {
  const projectRoot = any.string();

  beforeEach(() => {
    fileExists.mockResolvedValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return false when remark config is not present in the project', async () => {
    expect(await testForRemark({projectRoot})).toBe(false);
  });

  it('should return true when json remark config is present in the project', async () => {
    when(fileExists).calledWith(`${projectRoot}/.remarkrc.json`).mockResolvedValue(true);

    expect(await testForRemark({projectRoot})).toBe(true);
  });

  it('should return true when js remark config is present in the project', async () => {
    when(fileExists).calledWith(`${projectRoot}/.remarkrc.json`).mockResolvedValue(false);
    when(fileExists).calledWith(`${projectRoot}/.remarkrc.js`).mockResolvedValue(true);

    expect(await testForRemark({projectRoot})).toBe(true);
  });

  it('should return true when cjs remark config is present in the project', async () => {
    when(fileExists).calledWith(`${projectRoot}/.remarkrc.json`).mockResolvedValue(false);
    when(fileExists).calledWith(`${projectRoot}/.remarkrc.js`).mockResolvedValue(false);
    when(fileExists).calledWith(`${projectRoot}/.remarkrc.cjs`).mockResolvedValue(true);

    expect(await testForRemark({projectRoot})).toBe(true);
  });
});
