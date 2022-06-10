import any from '@travi/any';
import {assert} from 'chai';

import liftScripts from './lifter';

suite('package.json lifter', () => {
  test('that the provided scripts are merged with the existing scripts', async () => {
    const existingScripts = any.simpleObject();
    const scripts = any.simpleObject();

    const updatedScripts = liftScripts({existingScripts, scripts});

    assert.deepEqual(updatedScripts, {...existingScripts, ...scripts});
  });
});
