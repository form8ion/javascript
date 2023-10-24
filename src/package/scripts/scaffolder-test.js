import {assert} from 'chai';

import scaffold from './scaffolder.js';

suite('package.json scripts scaffolder', () => {
  test('that the scripts block is defined', async () => {
    assert.deepEqual(scaffold(), {});
  });
});
