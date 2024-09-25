import joi from 'joi';

export const vcsSchema = joi.object({
  host: joi.string().required(),
  owner: joi.string().required(),
  name: joi.string().required()
});
