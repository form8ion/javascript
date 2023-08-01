import joi from 'joi';

export const packageBundlersSchema = joi.object().pattern(/^/, joi.object({
  scaffolder: joi.func().arity(1).required()
})).default({});

export const applicationTypesSchema = joi.object().pattern(/^/, joi.object({
  scaffolder: joi.func().arity(1).required()
})).default({});

export const packageTypesSchema = joi.object().pattern(/^/, joi.object({
  scaffolder: joi.func().arity(1).required()
})).default({});
