import * as configFile from '@form8ion/config-file';
import {fileTypes} from '@form8ion/core';

import any from '@travi/any';
import {afterEach, describe, expect, it, vi} from 'vitest';

import write from './write.js';

vi.mock('@form8ion/config-file');

describe('write babel config', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should write the provided config to the rc file', async () => {
    const projectRoot = any.string();
    const config = any.simpleObject();

    await write({projectRoot, config});

    expect(configFile.write).toHaveBeenCalledWith({path: projectRoot, name: 'babel', format: fileTypes.JSON, config});
  });
});
