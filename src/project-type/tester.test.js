import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {test as packagePredicate} from './package';
import test from './tester';

vi.mock('./package');

describe('project-type tester', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the result of the package tester', async () => {
    const isPackage = any.boolean();
    when(packagePredicate).calledWith({projectRoot}).mockResolvedValue(isPackage);

    expect(await test({projectRoot})).toBe(isPackage);
  });
});
