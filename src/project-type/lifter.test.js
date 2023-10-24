import {afterEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {lift as liftPackage, test as packagePredicate} from './package/index.js';
import {lift as liftCli, test as cliPredicate} from './cli/index.js';
import lift from './lifter.js';

vi.mock('./package/index.js');
vi.mock('./cli/index.js');

describe('lift project-type', () => {
  const projectRoot = any.string();
  const packageDetails = any.simpleObject();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift a package project-type', async () => {
    const liftPackageResults = any.simpleObject();
    when(packagePredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(true);
    when(liftPackage).calledWith({projectRoot, packageDetails}).mockResolvedValue(liftPackageResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(liftPackageResults);
  });

  it('should lift a cli project-type', async () => {
    const liftCliResults = any.simpleObject();
    when(cliPredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(true);
    when(packagePredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);
    when(liftCli).calledWith({projectRoot, packageDetails}).mockResolvedValue(liftCliResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(liftCliResults);
  });

  it('should return empty results if the available project-type lifters do not apply', async () => {
    when(packagePredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);
    when(cliPredicate).calledWith({projectRoot, packageDetails}).mockResolvedValue(false);

    expect(await lift({projectRoot})).toEqual({});
  });
});
