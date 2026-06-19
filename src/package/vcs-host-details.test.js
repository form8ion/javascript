import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import defineVcsHostDetails from './vcs-host-details.js';

describe('vcs host details', () => {
  const owner = any.word();
  const name = any.word();
  const host = any.word();

  it('should define the repository details', () => {
    expect(defineVcsHostDetails({host, owner, name})).toEqual({
      repository: {
        type: 'git',
        url: `git+https://${host}/${owner}/${name}.git`
      },
      bugs: `https://${host}/${owner}/${name}/issues`
    });
  });

  it('should define the path within a monorepo', () => {
    const pathWithinParent = any.string();

    expect(defineVcsHostDetails({host, owner, name}, pathWithinParent).repository).toEqual({
      type: 'git',
      url: `git+https://${host}/${owner}/${name}.git`,
      directory: pathWithinParent
    });
  });
});
