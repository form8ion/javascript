import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import addIgnore from './config/ignore-adder.js';
import lift from './lifter.js';

vi.mock('./config/ignore-adder.js');

describe('babel-lifter', () => {
  it('should ignore the build directory', async () => {
    const projectRoot = any.string();
    const buildDirectory = any.string();

    expect(await lift({results: {buildDirectory}, projectRoot})).toEqual({});
    expect(addIgnore).toHaveBeenCalledWith({ignore: buildDirectory, projectRoot});
  });
});
