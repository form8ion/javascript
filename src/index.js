import {questionNames as languageScaffolderPromptsQuestionNames} from '@travi/language-scaffolder-prompts';

import {questionNames as jsScaffolderQuestionNames} from './prompts/question-names.js';

export {default as scaffoldUnitTesting} from './testing/unit.js';
export {default as scaffold} from './scaffolder/index.js';
export {default as lift} from './lift/index.js';
export {default as test} from './tester.js';
export const questionNames = {...languageScaffolderPromptsQuestionNames, ...jsScaffolderQuestionNames};
