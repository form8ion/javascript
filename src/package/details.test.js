import {dialects} from '@form8ion/javascript-core';

import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import defineDetails from './details.js';

describe('package details builder', () => {
  const authorName = `${any.word()} ${any.word()}`;
  const authorEmail = any.email();
  const authorWebsite = any.url();

  it('should define the initial details for the package.json file', () => {
    const packageName = any.word();
    const license = any.word();
    const description = any.sentence();

    expect(defineDetails({packageName, description, license, author: {name: authorName}})).toEqual({
      name: packageName,
      description,
      license,
      type: 'commonjs',
      author: authorName,
      scripts: {}
    });
  });

  it('should define `type` as `module` when the dialect is esm', () => {
    const {type} = defineDetails({author: {}, dialect: dialects.ESM});

    expect(type).toEqual('module');
  });

  it('should include author email when defined', () => {
    const {author} = defineDetails({author: {name: authorName, email: authorEmail}});

    expect(author).toEqual(`${authorName} <${authorEmail}>`);
  });

  it('should include author website when defined', () => {
    const {author} = defineDetails({author: {name: authorName, url: authorWebsite}});

    expect(author).toEqual(`${authorName} (${authorWebsite})`);
  });

  it('should include author email and website when both are defined', () => {
    const {author} = defineDetails({author: {name: authorName, email: authorEmail, url: authorWebsite}});

    expect(author).toEqual(`${authorName} <${authorEmail}> (${authorWebsite})`);
  });
});
