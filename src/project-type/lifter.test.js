import {afterEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {lift as liftPackage} from './package';
import lift from './lifter';

vi.mock('./package');

describe('lift project-type', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift a package project-type', async () => {
    const liftPackageResults = any.simpleObject();
    when(liftPackage).calledWith({projectRoot}).mockResolvedValue(liftPackageResults);

    expect(await lift({projectRoot})).toEqual(liftPackageResults);
  });
});
