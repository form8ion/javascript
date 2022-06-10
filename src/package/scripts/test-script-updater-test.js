import {assert} from 'chai';
import any from '@travi/any';

import updateTestScript from './test-script-updater';

suite('test script updater', () => {
  const scripts = {...any.simpleObject(), test: any.string(), [`lint:${any.word()}`]: any.string()};

  test('that the `test` script is defined', async () => {
    assert.deepEqual(
      updateTestScript(scripts),
      {...scripts, test: 'npm-run-all --print-label --parallel lint:*'}
    );
  });

  test('that `test` script includes building if a generate script for markdown is included', async () => {
    assert.deepEqual(
      updateTestScript({...scripts, 'pregenerate:md': 'run-s build'}),
      {...scripts, 'pregenerate:md': 'run-s build', test: 'npm-run-all --print-label build --parallel lint:*'}
    );
  });

  test('that the `test` script includes running tests when the project will be tested', async () => {
    const testScriptName = `test:${any.word()}`;
    const testScriptValue = any.string();

    assert.deepEqual(
      updateTestScript({...scripts, [testScriptName]: testScriptValue}),
      {
        ...scripts,
        [testScriptName]: testScriptValue,
        test: 'npm-run-all --print-label --parallel lint:* --parallel test:*'
      }
    );
  });
});
