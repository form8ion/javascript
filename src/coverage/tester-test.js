import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import * as c8Predicate from './c8/tester';
import * as nycPredicate from './nyc/tester';
import coverageIsConfigured from './tester';

suite('coverage predicate', () => {
  const projectRoot = any.string();
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(c8Predicate, 'default');
    sandbox.stub(nycPredicate, 'default');

    c8Predicate.default.resolves(false);
    nycPredicate.default.resolves(false);
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned when nyc is detected', async () => {
    nycPredicate.default.withArgs({projectRoot}).resolves(true);

    assert.isTrue(await coverageIsConfigured({projectRoot}));
  });

  test('that `true` is returned when c8 is detected', async () => {
    c8Predicate.default.withArgs({projectRoot}).resolves(true);

    assert.isTrue(await coverageIsConfigured({projectRoot}));
  });

  test('that `false` is returned when neither nyc nor c8 is detected', async () => {
    assert.isFalse(await coverageIsConfigured({projectRoot}));
  });
});
