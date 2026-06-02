import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import determinePackageAccessLevelFromProjectVisibility from './access-level.js';

describe('package access level', () => {
  it('should return `public` when project visibility is `OSS`', () => {
    expect(determinePackageAccessLevelFromProjectVisibility({projectVisibility: 'OSS'})).toEqual('public');
  });

  it('should return `restricted` when the project visibility is `ISS` or `CS`', () => {
    expect(determinePackageAccessLevelFromProjectVisibility({projectVisibility: any.fromList(['ISS', 'CS'])}))
      .toEqual('restricted');
  });
});
