import any from '@travi/any';
import {describe, expect, it} from 'vitest';

import updateTestScript from './test-script-updater.js';

describe('test script updater', () => {
  const scripts = {...any.simpleObject(), test: any.string(), [`lint:${any.word()}`]: any.string()};

  it('should define the `test` script', () => {
    expect(updateTestScript(scripts)).toEqual({...scripts, test: 'npm-run-all --print-label --parallel lint:*'});
  });

  it('should include a build step in the `test` script if a generate script for markdown is included', () => {
    expect(updateTestScript({...scripts, 'pregenerate:md': 'run-s build'})).toEqual({
      ...scripts,
      'pregenerate:md': 'run-s build',
      test: 'npm-run-all --print-label build --parallel lint:*'
    });
  });

  it('should include running tests in the `test` script when the project will be tested', () => {
    const testScriptName = `test:${any.word()}`;
    const testScriptValue = any.string();

    expect(updateTestScript({...scripts, [testScriptName]: testScriptValue})).toEqual({
      ...scripts,
      [testScriptName]: testScriptValue,
      test: 'npm-run-all --print-label --parallel lint:* --parallel test:*'
    });
  });
});
