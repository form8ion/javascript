import joi from 'joi';

export const vcs = joi.object({
  vcs: joi.object({
    host: joi.string().required(),
    owner: joi.string().required(),
    name: joi.string().required()
  })
});

export const configs = joi.object({remark: joi.string()}).default({});
