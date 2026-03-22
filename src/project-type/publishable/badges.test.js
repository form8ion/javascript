import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import defineBadges from './badges.js';

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
    expect(defineBadges({packageName, accessLevel: 'public'}).consumer).toEqual({npm: npmBadgeDetails});
  });

  it('should include the registry_uri in the npm badge when a custom registry is provided', () => {
    const customRegistry = any.url();

    const {searchParams} = new URL(defineBadges({packageName, accessLevel: 'public', customRegistry}).consumer.npm.img);

    expect(searchParams.get('registry_uri')).toEqual(customRegistry);
  });
});
