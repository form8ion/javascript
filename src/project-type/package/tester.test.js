import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import test from './tester.js';

describe('package project-type tester', () => {
  it('should return `true` if the project defines `exports`', async () => {
    expect(await test({packageDetails: {...any.simpleObject(), exports: any.word()}})).toBe(true);
  });

  it('should return `true` if the project defines `publishConfig`', async () => {
    expect(await test({packageDetails: {...any.simpleObject(), publishConfig: any.simpleObject()}})).toBe(true);
  });

  it('should return `false` if the project defines `bin` in addition to `publishConfig`', async () => {
    expect(await test({
      packageDetails: {...any.simpleObject(), publishConfig: any.simpleObject(), bin: any.simpleObject()}
    })).toBe(false);
  });

  it('should return `false` when there are no indicators that the project is a package type', async () => {
    expect(await test({packageDetails: any.simpleObject()})).toBe(false);
  });
});
