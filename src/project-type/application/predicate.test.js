import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import projectIsAnApplication from './predicate.js';

describe('application project-type predicate', () => {
  it('should return `true` for a project marked as `private` according to npm', async () => {
    expect(await projectIsAnApplication({packageDetails: {private: true}})).toBe(true);
  });

  it('should return `false` for a project not marked as `private` according to npm', async () => {
    expect(await projectIsAnApplication({packageDetails: any.simpleObject()})).toBe(false);
  });
});
