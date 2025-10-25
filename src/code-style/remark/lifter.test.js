import {fileTypes} from '@form8ion/core';
import {load, write} from '@form8ion/config-file';

import any from '@travi/any';
import {describe, it, expect, afterEach, vi} from 'vitest';
import {when} from 'vitest-when';

import lift from './lifter.js';

vi.mock('@form8ion/config-file');

describe('remark lifter', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should copy existing config to json format', async () => {
    const existingConfig = any.simpleObject();
    when(load).calledWith({name: 'remark'}).thenResolve(existingConfig);

    expect(await lift({projectRoot})).toEqual({});

    expect(write)
      .toHaveBeenCalledWith({format: fileTypes.JSON, path: projectRoot, name: 'remark', config: existingConfig});
  });
});
