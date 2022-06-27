import joi from 'joi';

export const packageBundlersSchema = joi.object().pattern(/^/, joi.object({
  scaffolder: joi.func().arity(1).required()
})).default({});
