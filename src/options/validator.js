import joi from 'joi';
import {validateOptions} from '@form8ion/core';

import {pluginsSchema} from '../plugins-schemas.js';
import {nameBasedConfigSchema, registriesSchema, scopeBasedConfigSchema, vcsSchema} from './schemas.js';

export function validate(options) {
  const schema = joi.object().required()
    .keys({
      projectRoot: joi.string().required(),
      projectName: joi.string().regex(/^@\w*\//, {invert: true}).required(),
      visibility: joi.string().valid('Public', 'Private').required(),
      license: joi.string().required(),
      description: joi.string(),
      pathWithinParent: joi.string()
    })
    .keys({vcs: vcsSchema})
    .keys({
      configs: joi.object({
        eslint: scopeBasedConfigSchema,
        typescript: scopeBasedConfigSchema,
        prettier: scopeBasedConfigSchema,
        commitlint: nameBasedConfigSchema,
        babelPreset: nameBasedConfigSchema,
        remark: joi.string()
      }).default({})
    })
    .keys({
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
    .keys({
      decisions: joi.object()
    })
    .keys({registries: registriesSchema});

  return validateOptions(schema, options);
}
