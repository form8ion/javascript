import joi from 'joi';
import {validateOptions} from '@form8ion/core';

import {beforeEach, describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {
  nameBasedConfigSchema, projectNameSchema,
  registriesSchema,
  scopeBasedConfigSchema,
  visibilitySchema
} from './schemas.js';
import {pluginsSchema} from '../plugins-schemas.js';
import {validate} from './validator.js';
import {vcsSchema} from '../vcs/schema.js';

vi.mock('@form8ion/core');

describe('options validator', () => {
  beforeEach(() => {
    vi.spyOn(joi, 'object');
    vi.spyOn(joi, 'string');
  });

  it('should validate the provided options against the js-plugin schema', () => {
    const options = any.simpleObject();
    const validatedOptions = any.simpleObject();
    const schema = any.simpleObject();
    const joiRequiredObject = vi.fn();
    const joiRequiredString = vi.fn();
    const requiredString = any.simpleObject();
    const joiString = {required: joiRequiredString};
    const joiObject = any.simpleObject();
    const configsDefault = vi.fn();
    const configs = any.simpleObject();
    when(joi.string).calledWith().thenReturn(joiString);
    when(joiRequiredString).calledWith().thenReturn(requiredString);
    when(joi.object).calledWith().thenReturn(joiObject);
    when(joi.object)
      .calledWith({
        eslint: scopeBasedConfigSchema,
        typescript: scopeBasedConfigSchema,
        prettier: scopeBasedConfigSchema,
        commitlint: nameBasedConfigSchema,
        babelPreset: nameBasedConfigSchema,
        remark: joiString,
        registries: registriesSchema
      })
      .thenReturn({default: configsDefault});
    when(configsDefault).calledWith({registries: {}}).thenReturn(configs);
    when(joi.object)
      .calledWith({
        projectRoot: requiredString,
        projectName: projectNameSchema,
        license: requiredString,
        visibility: visibilitySchema,
        description: joiString,
        pathWithinParent: joiString,
        decisions: joiObject,
        vcs: vcsSchema,
        configs,
        plugins: {
          unitTestFrameworks: pluginsSchema,
          packageBundlers: pluginsSchema,
          applicationTypes: pluginsSchema,
          packageTypes: pluginsSchema,
          monorepoTypes: pluginsSchema,
          hosts: pluginsSchema,
          ciServices: pluginsSchema
        }
      })
      .thenReturn({required: joiRequiredObject});
    when(joiRequiredObject).calledWith().thenReturn(schema);
    when(validateOptions).calledWith(schema, options).thenReturn(validatedOptions);

    expect(validate(options)).toEqual(validatedOptions);
  });
});
