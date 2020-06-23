import * as joi from '@hapi/joi';

export const unitTesting = joi.object().required().pattern(/^/, joi.object({
  scaffolder: joi.func().arity(1).required()
}));
