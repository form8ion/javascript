import {assert} from 'chai';
import any from '@travi/any';

import scaffoldBanSensitiveFiles from './ban-sensitive-files';

suite('lint for sensitive files', () => {
  test('that ban-sensitive-files is configured', () => {
    assert.deepEqual(
      scaffoldBanSensitiveFiles({}),
      {scripts: {'lint:sensitive': 'ban'}, devDependencies: ['ban-sensitive-files']}
    );
  });

  test('that ban-sensitive-files is not configured if the project being scaffolded is a sub-project', async () => {
    assert.deepEqual(scaffoldBanSensitiveFiles({pathWithinParent: any.string()}), {});
  });
});
