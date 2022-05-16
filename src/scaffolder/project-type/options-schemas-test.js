import {validateOptions} from '@form8ion/javascript-core';

import {assert} from 'chai';
import any from '@travi/any';

import {packageBundlersSchema} from './options-schemas';

suite('project-type options validation', () => {
  suite('package bundlers', () => {
    const key = any.word();

    test('that providing bundler plugins is optional', () => {
      validateOptions(packageBundlersSchema);
    });

    test('that a provided bundler must define a scaffolder', () => {
      assert.throws(() => validateOptions(packageBundlersSchema, {[key]: {}}), `"${key}.scaffolder" is required`);
    });

    test('that a provided bundler must define a scaffolder function', () => {
      assert.throws(
        () => validateOptions(packageBundlersSchema, {[key]: {scaffolder: any.word()}}),
        `"${key}.scaffolder" must be of type function`
      );
    });

    test('that a provided bundler must define a scaffolder function that takes an options object', () => {
      assert.throws(
        () => validateOptions(packageBundlersSchema, {[key]: {scaffolder: () => undefined}}),
        `"${key}.scaffolder" must have an arity of 1`
      );
    });

    test('that a provided bundler scaffolder is valid if an options object is provided', () => {
      validateOptions(packageBundlersSchema, {[key]: {scaffolder: options => options}});
    });
  });
});
