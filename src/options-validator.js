import joi from 'joi';
import {validateOptions} from '@form8ion/core';

import {pluginsSchema} from './plugins-schemas.js';

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
    .keys({
      vcs: joi.object({
        host: joi.string().required(),
        owner: joi.string().required(),
        name: joi.string().required()
      })
    })
    .keys({
      configs: joi.object({
        eslint: joi.object({scope: joi.string().regex(/^@[a-z0-9-]+$/i, 'scope').required()}),
        typescript: joi.object({scope: joi.string().regex(/^@[a-z0-9-]+$/i, 'scope').required()}),
        prettier: joi.object({scope: joi.string().regex(/^@[a-z0-9-]+$/i, 'scope').required()}),
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
      ciServices: joi.object().pattern(/^/, joi.object({
        scaffolder: joi.func().arity(1).required(),
        public: joi.boolean(),
        private: joi.boolean()
      })).default({})
    })
    .keys({
      plugins: {
        unitTestFrameworks: pluginsSchema,
        packageBundlers: pluginsSchema,
        applicationTypes: pluginsSchema,
        packageTypes: pluginsSchema,
        monorepoTypes: pluginsSchema,
        hosts: pluginsSchema
      }
    })
    .keys({
      decisions: joi.object()
    })
    .keys({registries: joi.object().pattern(joi.string(), joi.string().uri()).default({})});

  return validateOptions(schema, options);
}
