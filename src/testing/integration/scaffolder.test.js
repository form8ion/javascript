import {describe, it, expect} from 'vitest';

import scaffoldIntegrationTesting from './scaffolder.js';

describe('integration testing scaffolder', () => {
  it('should scaffold the chosen framework', async () => {
    expect(scaffoldIntegrationTesting()).toEqual({});
  });
});
