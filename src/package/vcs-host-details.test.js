import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import defineVcsHostDetails from './vcs-host-details.js';

describe('vcs host details', () => {
  it('should define the repository details when the host is github', () => {
    const owner = any.word();
    const name = any.word();

    expect(defineVcsHostDetails({host: 'github', owner, name})).toEqual({
      repository: `${owner}/${name}`,
      bugs: `https://github.com/${owner}/${name}/issues`
    });
  });
});
