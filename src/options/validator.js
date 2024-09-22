import joi from 'joi';
import {validateOptions} from '@form8ion/core';

import {pluginsSchema} from '../plugins-schemas.js';
import {
  nameBasedConfigSchema,
  projectNameSchema,
  registriesSchema,
  scopeBasedConfigSchema,
  visibilitySchema
} from './schemas.js';
import {vcsSchema} from '../vcs/schema.js';

export function validate(options) {
  const schema = joi.object({
    projectRoot: joi.string().required(),
    projectName: projectNameSchema,
    visibility: visibilitySchema,
    license: joi.string().required(),
    description: joi.string(),
    pathWithinParent: joi.string(),
    decisions: joi.object(),
    vcs: vcsSchema,
    configs: joi.object({
      eslint: scopeBasedConfigSchema,
      typescript: scopeBasedConfigSchema,
      prettier: scopeBasedConfigSchema,
      commitlint: nameBasedConfigSchema,
      babelPreset: nameBasedConfigSchema,
      remark: joi.string(),
      registries: registriesSchema
    }).default({}),
    plugins: {
      unitTestFrameworks: pluginsSchema,
      packageBundlers: pluginsSchema,
      applicationTypes: pluginsSchema,
      packageTypes: pluginsSchema,
      monorepoTypes: pluginsSchema,
      hosts: pluginsSchema,
      ciServices: pluginsSchema
    }
  }).required();

  return validateOptions(schema, options);
}
