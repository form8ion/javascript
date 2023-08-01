import deepmerge from 'deepmerge';

import {describe, it, expect, afterEach, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import badgeDetailsBuilder from './badges';

vi.mock('deepmerge');

describe('badges', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should merge the category lists', () => {
    const mergedBadges = any.simpleObject();
    const contributedResults = any.listOf(any.simpleObject);
    when(deepmerge.all).calledWith(contributedResults).mockReturnValue({badges: mergedBadges});

    expect(badgeDetailsBuilder(contributedResults)).toEqual(mergedBadges);
  });
});
