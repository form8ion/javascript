import {describe, expect, it} from 'vitest';

import determineSlsaLevel from './slsa';

describe('SLSA badge', () => {
  it('should return the SLSA Level 2 badge for public publishable projects that publish with provenance', () => {
    const {badges} = determineSlsaLevel({provenance: true});

    expect(badges.status.slsa).toEqual({
      img: 'https://slsa.dev/images/gh-badge-level2.svg',
      url: 'https://slsa.dev',
      text: 'SLSA Level 2'
    });
  });

  it('should not return a badge if the package is not published with provenance', () => {
    const {badges} = determineSlsaLevel({});

    expect(badges).toBe(undefined);
  });
});
