import joi from 'joi';
import {visibilityOptions} from '@form8ion/core';

export const scopeBasedConfigSchema = joi.object({scope: joi.string().regex(/^@[a-z0-9-]+$/i, 'scope').required()});

export const nameBasedConfigSchema = joi.object({
  packageName: joi.string().required(),
  name: joi.string().required()
});

export const registriesSchema = joi.object().pattern(joi.string(), joi.string().uri()).default({});

export const visibilitySchema = joi.string().valid(...Object.keys(visibilityOptions)).required();

export const projectNameSchema = joi.string().regex(/^@\w*\//, {invert: true}).required();
