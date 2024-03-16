import {vi, it, describe, afterEach, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {test as nvmIsUsed} from './node-version/index.js';
import {test as jsPackageManagerIsUsed} from './package-managers/index.js';
import testApplicability from './tester.js';

vi.mock('./node-version/index.js');
vi.mock('./package-managers/index.js');

describe('javascript predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` if nvm is detected', async () => {
    when(nvmIsUsed).calledWith({projectRoot}).mockResolvedValue(true);

    expect(await testApplicability({projectRoot})).toBe(true);
  });

  it('should return `true` if a javascript package manager is detected', async () => {
    when(jsPackageManagerIsUsed).calledWith({projectRoot}).mockResolvedValue(true);

    expect(await testApplicability({projectRoot})).toBe(true);
  });

  it('should return `false` if neither nvm nor a js package manager is found', async () => {
    when(nvmIsUsed).calledWith({projectRoot}).mockResolvedValue(false);
    when(jsPackageManagerIsUsed).calledWith({projectRoot}).mockResolvedValue(false);

    expect(await testApplicability({projectRoot})).toBe(false);
  });
});
