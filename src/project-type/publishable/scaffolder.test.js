import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import scaffoldBadges from './badges';
import scaffoldPublishable from './scaffolder';

vi.mock('./badges');

describe('publishable project-type scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold common details of a package project', async () => {
    const packageName = any.word();
    const packageAccessLevel = any.word();
    const badgesResults = any.simpleObject();
    when(scaffoldBadges).calledWith(packageName, packageAccessLevel).mockReturnValue(badgesResults);

    expect(await scaffoldPublishable({packageName, packageAccessLevel})).toEqual({badges: badgesResults});
  });
});
