import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import test from './tester.js';

describe('cli project-type tester', () => {
  it('should return `true` when the project defines `bin`', async () => {
    expect(await test({packageDetails: {...any.simpleObject(), bin: any.simpleObject()}})).toBe(true);
  });

  it('should return `false` when the project does not define `bin`', async () => {
    expect(await test({packageDetails: any.simpleObject()})).toBe(false);
  });
});
