import {describe, it, expect} from 'vitest';

import registriesAreUsed from './tester.js';

describe('registries tester', () => {
  it('should always return `true`', async () => {
    expect(await registriesAreUsed()).toBe(true);
  });
});
