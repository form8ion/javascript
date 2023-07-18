import {validateOptions} from '@form8ion/core';
import {assert} from 'chai';
import any from '@travi/any';
import {unitTestFrameworksSchema} from './options-schemas';

suite('testing options validation', () => {
  suite('unit test frameworks', () => {
    const key = any.word();

    test('that the options are required', () => {
      assert.throws(() => validateOptions(unitTestFrameworksSchema), '"value" is required');
    });

    test('that a provided framework must define a scaffolder', () => {
      assert.throws(() => validateOptions(unitTestFrameworksSchema, {[key]: {}}), `"${key}.scaffolder" is required`);
    });

    test('that a provided framework must define a scaffolder function', () => {
      assert.throws(
        () => validateOptions(unitTestFrameworksSchema, {[key]: {scaffolder: any.word()}}),
        `"${key}.scaffolder" must be of type function`
      );
    });

    test('that a provided framework must define a scaffolder function that takes an options object', () => {
      assert.throws(
        () => validateOptions(unitTestFrameworksSchema, {[key]: {scaffolder: () => undefined}}),
        `"${key}.scaffolder" must have an arity of 1`
      );
    });

    test('that a provided framework scaffolder is valid if an options object is provided', () => {
      validateOptions(unitTestFrameworksSchema, {[key]: {scaffolder: options => options}});
    });
  });
});
