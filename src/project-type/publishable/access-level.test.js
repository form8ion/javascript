import {describe, expect, it} from 'vitest';

import determinePackageAccessLevelFromProjectVisibility from './access-level.js';

describe('package access level', () => {
  it('should return `public` when project visibility is `Public`', () => {
    expect(determinePackageAccessLevelFromProjectVisibility({projectVisibility: 'Public'})).toEqual('public');
  });

  it('should return `restricted` when the project visibility is `Private`', () => {
    expect(determinePackageAccessLevelFromProjectVisibility({projectVisibility: 'Private'})).toEqual('restricted');
  });
});
