import {expect, it, describe} from 'vitest';

import {scope} from './validators.js';

describe('question validators', () => {
  it('should require a scope for private project', () => {
    expect(scope('Private')()).toEqual(
      'Private packages must be scoped (https://docs.npmjs.com/private-modules/intro#setting-up-your-package)'
    );
  });

  it('it should consider a provided value to be a valid answer to private projects', () => {
    expect(scope('Public')()).toBe(true);
  });

  it('it should consider an empty value to be a valid answer to public projects', () => {
    expect(scope('Public')()).toBe(true);
  });
});
