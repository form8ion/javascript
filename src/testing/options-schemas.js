import joi from 'joi';

export const unitTestFrameworksSchema = joi.object().required().pattern(/^/, joi.object({
  scaffolder: joi.func().arity(1).required()
}));
