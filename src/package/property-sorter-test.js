import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as sortObjectKeys from '../../thirdparty-wrappers/sort-object-keys';
import sortProperties from './property-sorter';

suite('package.json property sorter', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(sortObjectKeys, 'default');
  });

  teardown(() => sandbox.restore());

  test('that package properties are sorted based on the defined order', async () => {
    const packageContents = any.simpleObject();
    const sortedPackageContents = any.simpleObject();
    sortObjectKeys.default
      .withArgs(
        packageContents,
        [
          'name',
          'description',
          'license',
          'version',
          'type',
          'engines',
          'author',
          'repository',
          'bugs',
          'homepage',
          'keywords',
          'runkitExampleFilename',
          'exports',
          'bin',
          'main',
          'module',
          'types',
          'sideEffects',
          'scripts',
          'files',
          'publishConfig',
          'config',
          'dependencies',
          'devDependencies',
          'peerDependencies'
        ]
      )
      .returns(sortedPackageContents);

    assert.deepEqual(sortProperties(packageContents), sortedPackageContents);
  });
});
