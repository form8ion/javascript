import {assert} from 'chai';

import scaffoldEsmDialect from './scaffolder';

suite('ESM dialect', () => {
  test('that the `engines` definition limits to versions properly supporting EMS', async () => {
    const {packageProperties} = await scaffoldEsmDialect();

    assert.equal(packageProperties.engines.node, '>=12.20');
  });
});
