import {afterEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {lift as liftPackage, test as packagePredicate} from './package';
import {lift as liftCli, test as cliPredicate} from './cli';
import lift from './lifter';

vi.mock('./package');
vi.mock('./cli');

describe('lift project-type', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift a package project-type', async () => {
    const liftPackageResults = any.simpleObject();
    when(packagePredicate).calledWith({projectRoot}).mockResolvedValue(true);
    when(liftPackage).calledWith({projectRoot}).mockResolvedValue(liftPackageResults);

    expect(await lift({projectRoot})).toEqual(liftPackageResults);
  });

  it('should lift a cli project-type', async () => {
    const liftCliResults = any.simpleObject();
    when(cliPredicate).calledWith({projectRoot}).mockResolvedValue(true);
    when(packagePredicate).calledWith({projectRoot}).mockResolvedValue(false);
    when(liftCli).calledWith({projectRoot}).mockResolvedValue(liftCliResults);

    expect(await lift({projectRoot})).toEqual(liftCliResults);
  });

  it('should return empty results if the available project-type lifters do not apply', async () => {
    when(packagePredicate).calledWith({projectRoot}).mockResolvedValue(false);
    when(cliPredicate).calledWith({projectRoot}).mockResolvedValue(false);

    expect(await lift({projectRoot})).toEqual({});
  });
});
