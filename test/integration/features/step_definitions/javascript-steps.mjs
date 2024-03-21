import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the project is determined to not be a JavaScript project', async function () {
  assert.isFalse(this.isJavaScriptProject);
});
