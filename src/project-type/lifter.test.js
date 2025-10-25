import {afterEach, describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {lift as liftPackage, test as packagePredicate} from './package/index.js';
import {lift as liftCli, test as cliPredicate} from './cli/index.js';
import lift from './lifter.js';

vi.mock('@form8ion/javascript-core');
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
    when(packagePredicate).calledWith({projectRoot, packageDetails}).thenResolve(true);
    when(liftPackage).calledWith({projectRoot, packageDetails}).thenResolve(liftPackageResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(liftPackageResults);
  });

  it('should lift a cli project-type', async () => {
    const liftCliResults = any.simpleObject();
    when(cliPredicate).calledWith({projectRoot, packageDetails}).thenResolve(true);
    when(packagePredicate).calledWith({projectRoot, packageDetails}).thenResolve(false);
    when(liftCli).calledWith({projectRoot, packageDetails}).thenResolve(liftCliResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(liftCliResults);
  });

  it('should define the repository as the homepage if the available project-type lifters do not apply', async () => {
    const vcsOwner = any.word();
    const vcsName = any.word();
    when(packagePredicate).calledWith({projectRoot, packageDetails}).thenResolve(false);
    when(cliPredicate).calledWith({projectRoot, packageDetails}).thenResolve(false);

    expect(await lift({projectRoot, vcs: {host: 'github', owner: vcsOwner, name: vcsName}}))
      .toEqual({homepage: `https://github.com/${vcsOwner}/${vcsName}#readme`});
  });

  it(
    'should return empty results if the available project-type lifters do not apply and not hosted on github',
    async () => {
      when(packagePredicate).calledWith({projectRoot, packageDetails}).thenResolve(false);
      when(cliPredicate).calledWith({projectRoot, packageDetails}).thenResolve(false);

      expect(await lift({projectRoot, vcs: {host: any.word()}})).toEqual({});
    }
  );

  it(
    'should return empty results if the available project-type lifters do not apply and not version controlled',
    async () => {
      when(packagePredicate).calledWith({projectRoot, packageDetails}).thenResolve(false);
      when(cliPredicate).calledWith({projectRoot, packageDetails}).thenResolve(false);

      expect(await lift({projectRoot})).toEqual({});
    }
  );
});
