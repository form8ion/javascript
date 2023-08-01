import joi from 'joi';

const pluginSchema = joi.object().pattern(/^/, joi.object({
  scaffolder: joi.func().arity(1).required()
})).default({});

export const packageBundlersSchema = pluginSchema;

export const applicationTypesSchema = pluginSchema;

export const packageTypesSchema = pluginSchema;

export const monorepoTypesSchema = pluginSchema;
