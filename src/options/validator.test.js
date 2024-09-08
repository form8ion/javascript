import joi from 'joi';
import {validateOptions} from '@form8ion/core';

import {beforeEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {
  nameBasedConfigSchema, projectNameSchema,
  registriesSchema,
  scopeBasedConfigSchema,
  vcsSchema,
  visibilitySchema
} from './schemas.js';
import {pluginsSchema} from '../plugins-schemas.js';
import {validate} from './validator.js';

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
    joi.string.mockReturnValue(joiString);
    when(joiRequiredString).calledWith().mockReturnValue(requiredString);
    when(joi.object).calledWith().mockReturnValue(joiObject);
    when(joi.object)
      .calledWith({
        eslint: scopeBasedConfigSchema,
        typescript: scopeBasedConfigSchema,
        prettier: scopeBasedConfigSchema,
        commitlint: nameBasedConfigSchema,
        babelPreset: nameBasedConfigSchema,
        remark: joiString
      })
      .mockReturnValue({default: configsDefault});
    when(configsDefault).calledWith({}).mockReturnValue(configs);
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
        registries: registriesSchema,
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
      .mockReturnValue({required: joiRequiredObject});
    when(joiRequiredObject).calledWith().mockReturnValue(schema);
    when(validateOptions).calledWith(schema, options).mockReturnValue(validatedOptions);

    expect(validate(options)).toEqual(validatedOptions);
  });
});
