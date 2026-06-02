import {expect, it, describe} from 'vitest';
import any from '@travi/any';

import {scope} from './validators.js';

describe('question validators', () => {
  it('should require a scope for a closed-source project', () => {
    expect(scope('CS')()).toEqual('Closed source packages must be scoped');
  });

  it('should require a scope for an inner-source project', () => {
    expect(scope('ISS')()).toEqual('Inner source packages must be scoped');
  });

  it('it should consider a provided value to be a valid answer to private projects', () => {
    expect(scope('OSS')(any.word())).toBe(true);
  });

  it('it should consider an empty value to be a valid answer to public projects', () => {
    expect(scope('OSS')()).toBe(true);
  });
});
