import * as joi from 'joi';

export const packageBundlersSchema = joi.object().required().pattern(/^/, joi.object({
  scaffolder: joi.func().arity(1).required()
}));
