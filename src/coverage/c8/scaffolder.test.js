import {fileTypes} from '@form8ion/core';
import {write} from '@form8ion/config-file';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import scaffoldC8 from './scaffolder';

vi.mock('@form8ion/config-file');

describe('c8 scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold c8', async () => {
    const projectRoot = any.string();
    const vcsOwner = any.word();
    const vcsName = any.word();

    expect(await scaffoldC8({projectRoot, vcs: {owner: vcsOwner, name: vcsName, host: 'github'}, visibility: 'Public'}))
      .toEqual({
        devDependencies: ['cross-env', 'c8'],
        vcsIgnore: {files: [], directories: ['/coverage/']},
        eslint: {ignore: {directories: ['/coverage/']}}
      });
    expect(write).toHaveBeenCalledWith({
      name: 'c8',
      format: fileTypes.JSON,
      path: projectRoot,
      config: {
        reporter: ['lcov', 'text-summary', 'html'],
        exclude: ['src/**/*-test.js', 'test/', 'thirdparty-wrappers/', 'vendor/']
      }
    });
  });
});
