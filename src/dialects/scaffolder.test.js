import {dialects} from '@form8ion/javascript-core';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';

import {scaffold as scaffoldBabel} from './babel/index.js';
import {scaffold as scaffoldTypescript} from './typescript/index.js';
import scaffoldDialect from './scaffolder.js';

vi.mock('./babel/index.js');
vi.mock('./typescript/index.js');

describe('dialect scaffolder', () => {
  const projectRoot = any.string();

  it('should not scaffold babel or typescript when not chosen', async () => {
    expect(await scaffoldDialect({dialect: any.word()})).toEqual({});
    expect(scaffoldBabel).not.toHaveBeenCalled();
    expect(scaffoldTypescript).not.toHaveBeenCalled();
  });

  it('should scaffold babel when chosen', async () => {
    const babelPreset = any.word();
    const babelResults = any.simpleObject();
    when(scaffoldBabel).calledWith({preset: babelPreset, projectRoot}).thenResolve(babelResults);

    expect(await scaffoldDialect({dialect: dialects.BABEL, configs: {babelPreset}, projectRoot}))
      .toEqual(babelResults);
  });

  it('should scaffold typescript when chosen', async () => {
    const typescriptConfigs = any.simpleObject();
    const typescriptResults = any.simpleObject();
    const testFilenamePattern = any.string();
    const projectType = any.word();
    when(scaffoldTypescript)
      .calledWith({config: typescriptConfigs, projectType, projectRoot, testFilenamePattern})
      .thenResolve(typescriptResults);

    expect(await scaffoldDialect({
      dialect: dialects.TYPESCRIPT,
      projectType,
      configs: {typescript: typescriptConfigs},
      projectRoot,
      testFilenamePattern
    })).toEqual(typescriptResults);
  });
});
