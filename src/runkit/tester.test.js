import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import runkitIsConfigured from './tester.js';

describe('runkit predicate', () => {
  it('should return `true` if the `runkitExampleFilename` property exists in the `package.json`', async () => {
    expect(
      await runkitIsConfigured({packageDetails: {...any.simpleObject(), runkitExampleFilename: any.word()}})
    ).toBe(true);
  });

  it('should return `false` if the `runkitExampleFilename` property does not exist in the `package.json`', async () => {
    expect(await runkitIsConfigured({packageDetails: any.simpleObject()})).toBe(false);
  });
});
