import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import defineBadges from './badges';

describe('badges for publishable project types', async () => {
  const packageName = any.word();
  const npmBadgeDetails = {
    img: `https://img.shields.io/npm/v/${packageName}?logo=npm`,
    text: 'npm',
    link: `https://www.npmjs.com/package/${packageName}`
  };

  it('should define the badges when the access level is not public', () => {
    expect(defineBadges(packageName)).toEqual({consumer: {}, status: {}});
  });

  it('should return the npm badge for packages with a public access level', () => {
    expect(defineBadges(packageName, 'public').consumer).toEqual({npm: npmBadgeDetails});
  });
});
