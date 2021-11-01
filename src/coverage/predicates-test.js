import {assert} from 'chai';
import any from '@travi/any';
import {shouldBeReported} from './predicates';

suite('coverage', () => {
  test('that `true` is returned for public projects that will be unit-tested', () => {
    assert.isTrue(shouldBeReported('Public', {unit: true}));
  });

  test('that `false` is returned if the project is not public', () => {
    assert.isFalse(shouldBeReported(any.word(), {unit: true}));
  });

  test('that `false` is returned for public projects that will not be unit-tested', () => {
    assert.isFalse(shouldBeReported('Public', {unit: false}));
  });
});
