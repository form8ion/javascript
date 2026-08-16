import {PROJECT_TYPE_PLUGIN_PROMPT_ID} from '../project-type-plugin/prompt.js';
import {PACKAGE_BUNDLER_PROMPT_ID} from '../project-type/publishable/bundler/prompt.js';
import {UNIT_TESTING_PROMPT_ID} from '../testing/unit/prompt.js';
import {INTEGRATION_TESTING_PROMPT_ID} from '../testing/integration/prompt.js';
import {JAVASCRIPT_BASE_DETAILS_PROMPT_ID} from './questions.js';
import {questionNames} from './question-names.js';

export const ids = {
  JAVASCRIPT_BASE_DETAILS: JAVASCRIPT_BASE_DETAILS_PROMPT_ID,
  PROJECT_TYPE_PLUGIN: PROJECT_TYPE_PLUGIN_PROMPT_ID,
  PACKAGE_BUNDLER: PACKAGE_BUNDLER_PROMPT_ID,
  UNIT_TESTING: UNIT_TESTING_PROMPT_ID,
  INTEGRATION_TESTING: INTEGRATION_TESTING_PROMPT_ID
};

export {questionNames};

export const constants = {ids, questionNames};
