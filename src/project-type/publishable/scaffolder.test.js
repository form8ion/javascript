import {describe, expect, it} from 'vitest';

import scaffoldPublishable from './scaffolder.js';

describe('publishable project-type scaffolder', () => {
  it('should scaffold common details of a package project', async () => {
    expect(await scaffoldPublishable()).toEqual({});
  });
});
