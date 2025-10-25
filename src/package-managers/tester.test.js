import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {test as npmIsUsed} from './npm/index.js';
import {test as yarnIsUsed} from './yarn/index.js';
import test from './tester.js';

vi.mock('./npm/index.js');
vi.mock('./yarn/index.js');

describe('package managers predicate', () => {
  const projectRoot = any.string();

  it('should return `true` if npm is used', async () => {
    when(npmIsUsed).calledWith({projectRoot}).thenResolve(true);

    expect(await test({projectRoot})).toBe(true);
  });

  it('should return `true` if yarn is used', async () => {
    when(yarnIsUsed).calledWith({projectRoot}).thenResolve(true);

    expect(await test({projectRoot})).toBe(true);
  });

  it('should return `false` if neither npm nor yarn is used', async () => {
    when(npmIsUsed).calledWith({projectRoot}).thenResolve(false);
    when(yarnIsUsed).calledWith({projectRoot}).thenResolve(false);

    expect(await test({projectRoot})).toBe(false);
  });
});
