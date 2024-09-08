import joi from 'joi';
import {validateOptions} from '@form8ion/core';

import {pluginsSchema} from '../plugins-schemas.js';
import {
  nameBasedConfigSchema,
  projectNameSchema,
  registriesSchema,
  scopeBasedConfigSchema,
  vcsSchema,
  visibilitySchema
} from './schemas.js';

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
    registries: registriesSchema,
    configs: joi.object({
      eslint: scopeBasedConfigSchema,
      typescript: scopeBasedConfigSchema,
      prettier: scopeBasedConfigSchema,
      commitlint: nameBasedConfigSchema,
      babelPreset: nameBasedConfigSchema,
      remark: joi.string()
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
  //   .keys({
  //     projectName: joi.string().regex(/^@\w*\//, {invert: true}).required(),
  //   })

  return validateOptions(schema, options);
}
