import joi from 'joi';
import {validateOptions} from '@form8ion/core';

import {pluginsSchema} from '../plugins-schemas.js';
import {scopeBasedConfigSchema, vcs} from './schemas.js';

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
    .keys({vcs})
    .keys({
      configs: joi.object({
        eslint: scopeBasedConfigSchema,
        typescript: scopeBasedConfigSchema,
        prettier: scopeBasedConfigSchema,
        commitlint: joi.object({
          packageName: joi.string().required(),
          name: joi.string().required()
        }),
        babelPreset: joi.object({
          packageName: joi.string().required(),
          name: joi.string().required()
        }),
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
    .keys({registries: joi.object().pattern(joi.string(), joi.string().uri()).default({})});

  return validateOptions(schema, options);
}
