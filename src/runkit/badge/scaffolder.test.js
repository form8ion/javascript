import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import scaffoldRunkitBadge from './scaffolder.js';

describe('runkit badge scaffolder', () => {
  it('should define the badge details', async () => {
    const packageName = any.word();

    expect(scaffoldRunkitBadge({packageName, visibility: 'Public'})).toEqual({
      badges: {
        consumer: {
          runkit: {
            img: `https://badge.runkitcdn.com/${packageName}.svg`,
            text: `Try ${packageName} on RunKit`,
            link: `https://npm.runkit.com/${packageName}`
          }
        }
      }
    });
  });

  it('should not define the badge when the project is not public', async () => {
    expect(scaffoldRunkitBadge({visibility: any.word()})).toEqual({badges: {consumer: {}}});
  });
});
