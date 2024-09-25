import {dialects} from '@form8ion/javascript-core';

import any from '@travi/any';
import {describe, expect, it} from 'vitest';

import buildDialectChoices from './prompt-choices.js';

describe('dialect prompt questions', () => {
  it('should list available dialects', () => {
    expect(buildDialectChoices({
      ...any.simpleObject(),
      babelPreset: any.simpleObject(),
      typescript: any.simpleObject()
    })).toEqual([
      {name: 'Common JS (no transpilation)', value: dialects.COMMON_JS, short: 'cjs'},
      {name: 'Modern JavaScript (transpiled)', value: dialects.BABEL, short: 'modern'},
      {name: 'ESM-only (no transpilation)', value: dialects.ESM, short: 'esm'},
      {name: 'TypeScript', value: dialects.TYPESCRIPT, short: 'ts'}
    ]);
  });

  it('should not include babel or typescript in the choices list when configs are not provided', () => {
    expect(buildDialectChoices(any.simpleObject())).toEqual([
      {name: 'Common JS (no transpilation)', value: dialects.COMMON_JS, short: 'cjs'},
      {name: 'ESM-only (no transpilation)', value: dialects.ESM, short: 'esm'}
    ]);
  });
});
