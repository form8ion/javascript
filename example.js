// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffoldUnitTesting, questionNames} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

(async () => {
  await scaffoldUnitTesting({
    projectRoot: process.cwd(),
    frameworks: {
      Mocha: {scaffolder: options => options},
      Jest: {scaffolder: options => options}
    },
    visibility: 'Public',
    vcs: {host: 'GitHub', owner: 'foo', name: 'bar'},
    decisions: {[questionNames.UNIT_TEST_FRAMEWORK]: 'Mocha'}
  });
})();
