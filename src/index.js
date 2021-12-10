import {questionNames as languageScaffolderPromptsQuestionNames} from '@travi/language-scaffolder-prompts';
import {questionNames as jsScaffolderQuestionNames} from './prompts/question-names';

export {default as scaffoldUnitTesting} from './testing/unit';
export {default as scaffold} from './scaffolder';
export const questionNames = {...languageScaffolderPromptsQuestionNames, ...jsScaffolderQuestionNames};
