import any from '@travi/any';
import {describe, it, expect, vi} from 'vitest';

import {write} from './config/index.js';
import scaffoldBabel from './scaffolder.js';

vi.mock('./config/index.js');

describe('babel scaffolder', () => {
  const projectRoot = any.string();

  it('should write the babelrc if a preset is provided', async () => {
    const babelPresetName = any.string();
    const babelPresetPackageName = any.word();
    const babelPreset = {name: babelPresetName, packageName: babelPresetPackageName};

    expect(await scaffoldBabel({preset: babelPreset, projectRoot, tests: {unit: true}}))
      .toEqual({dependencies: {javascript: {development: ['@babel/register', babelPresetPackageName]}}, eslint: {}});
    expect(write).toHaveBeenCalledWith({projectRoot, config: {presets: [babelPresetName]}});
  });

  it('should throw an error if a preset is not defined', async () => {
    await expect(() => scaffoldBabel({preset: undefined, projectRoot}))
      .rejects.toThrowError('No babel preset provided. Cannot configure babel transpilation');

    expect(write).not.toHaveBeenCalled();
  });
});
