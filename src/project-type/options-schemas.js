import joi from 'joi';

const pluginSchema = joi.object({scaffolder: joi.func().arity(1).required()});
const pluginMapSchema = joi.object().pattern(joi.string(), pluginSchema);

export const packageBundlersSchema = pluginMapSchema.default({});

export const applicationTypesSchema = pluginMapSchema.default({});

export const packageTypesSchema = pluginMapSchema.default({});

export const monorepoTypesSchema = pluginMapSchema.default({});
