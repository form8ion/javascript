import {assert} from 'chai';
import any from '@travi/any';
import validate from '../options-validator';
import {unitTestFrameworksSchema} from './options-schemas';

suite('testing options validation', () => {
  suite('unit test frameworks', () => {
    const key = any.word();

    test('that the options are required', () => {
      assert.throws(() => validate(unitTestFrameworksSchema), '"value" is required');
    });

    test('that a provided framework must define a scaffolder', () => {
      assert.throws(() => validate(unitTestFrameworksSchema, {[key]: {}}), `"${key}.scaffolder" is required`);
    });

    test('that a provided framework must define a scaffolder function', () => {
      assert.throws(
        () => validate(unitTestFrameworksSchema, {[key]: {scaffolder: any.word()}}),
        `"${key}.scaffolder" must be of type function`
      );
    });

    test('that a provided framework must define a scaffolder function that takes an options object', () => {
      assert.throws(
        () => validate(unitTestFrameworksSchema, {[key]: {scaffolder: () => undefined}}),
        `"${key}.scaffolder" must have an arity of 1`
      );
    });

    test('that a provided framework scaffolder is valid if an options object is provided', () => {
      validate(unitTestFrameworksSchema, {[key]: {scaffolder: options => options}});
    });
  });
});
