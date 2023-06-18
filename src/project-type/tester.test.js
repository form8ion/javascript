import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {test as packagePredicate} from './package';
import {test as cliPredicate} from './cli';
import test from './tester';

vi.mock('./package');
vi.mock('./cli');

describe('project-type tester', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` if the result of the package tester is `true`', async () => {
    when(packagePredicate).calledWith({projectRoot}).mockResolvedValue(true);
    when(cliPredicate).calledWith({projectRoot}).mockResolvedValue(false);

    expect(await test({projectRoot})).toBe(true);
  });

  it('should return `true` if the result of the cli tester is `true`', async () => {
    when(cliPredicate).calledWith({projectRoot}).mockResolvedValue(true);
    when(packagePredicate).calledWith({projectRoot}).mockResolvedValue(false);

    expect(await test({projectRoot})).toBe(true);
  });

  it('should return `false` if none of the available testers result in `true`', async () => {
    when(cliPredicate).calledWith({projectRoot}).mockResolvedValue(false);
    when(packagePredicate).calledWith({projectRoot}).mockResolvedValue(false);

    expect(await test({projectRoot})).toBe(false);
  });
});
