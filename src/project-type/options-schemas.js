import joi from 'joi';
import {optionsSchemas} from '@form8ion/core';

const pluginMapSchema = joi.object().pattern(joi.string(), optionsSchemas.form8ionPlugin);

export const packageBundlersSchema = pluginMapSchema.default({});

export const applicationTypesSchema = pluginMapSchema.default({});

export const packageTypesSchema = pluginMapSchema.default({});

export const monorepoTypesSchema = pluginMapSchema.default({});
