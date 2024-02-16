import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {test as packagePredicate} from './package/index.js';
import {test as cliPredicate} from './cli/index.js';
import {test as applicationPredicate} from './application/index.js';
import test from './tester.js';

vi.mock('./package');
vi.mock('./cli');
vi.mock('./application');

describe('project-type tester', () => {
  const projectRoot = any.string();
  const packageDetails = any.simpleObject();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` if the result of the package tester is `true`', async () => {
    when(packagePredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(true);
    when(cliPredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);

    expect(await test({projectRoot, packageDetails})).toBe(true);
  });

  it('should return `true` if the result of the cli tester is `true`', async () => {
    when(cliPredicate).calledWith({projectRoot}).mockResolvedValue(true);
    when(packagePredicate).calledWith({projectRoot}).mockResolvedValue(false);

    expect(await test({projectRoot})).toBe(true);
  });

  it('should return `true` if the result of the application tester is `true`', async () => {
    when(applicationPredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(true);
    when(cliPredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);
    when(packagePredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);

    expect(await test({projectRoot, packageDetails})).toBe(true);
  });

  it('should return `false` if none of the available testers result in `true`', async () => {
    when(applicationPredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);
    when(cliPredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);
    when(packagePredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);

    expect(await test({projectRoot, packageDetails})).toBe(false);
  });
});
