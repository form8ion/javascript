import joi from 'joi';

export const vcs = joi.object({
  host: joi.string().required(),
  owner: joi.string().required(),
  name: joi.string().required()
});

export const scopeBasedConfigSchema = joi.object({scope: joi.string().regex(/^@[a-z0-9-]+$/i, 'scope').required()});

export const nameBasedConfigSchema = joi.object({
  packageName: joi.string().required(),
  name: joi.string().required()
});
