import joi from 'joi';
import {optionsSchemas} from '@form8ion/core';

export const unitTestFrameworksSchema = joi.object().pattern(/^/, optionsSchemas.form8ionPlugin).default({});
