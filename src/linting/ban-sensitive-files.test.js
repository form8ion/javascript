import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import scaffoldBanSensitiveFiles from './ban-sensitive-files';

describe('lint for sensitive files', () => {
  it('should configure ban-sensitive-files', () => {
    expect(scaffoldBanSensitiveFiles({}))
      .toEqual({scripts: {'lint:sensitive': 'ban'}, devDependencies: ['ban-sensitive-files']});
  });

  it('should not configure ban-sensitive-files if the project being scaffolded is a sub-project', () => {
    expect(scaffoldBanSensitiveFiles({pathWithinParent: any.string()})).toEqual({});
  });
});
