import assert from 'node:assert';
import {Before, Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';

Before(async function () {
  this.ciServiceScaffolded = false;
});

Given('the CI service is configured for the repository', async function () {
  this.ciContextIsConfigured = true;

  this.ciServicePlugins = {
    [any.word()]: {
      qualify: () => true,
      scaffold: foo => {
        this.ciServiceScaffolded = true;

        return {foo};
      }
    }
  };
});

Given('the CI service is not configured for the repository', async function () {
  this.ciContextIsConfigured = false;
});

Then('the CI workflow is scaffolded', async function () {
  assert.strictEqual(this.ciServiceScaffolded, true);
});

Then('no CI workflow is scaffolded', async function () {
  assert.strictEqual(this.ciServiceScaffolded, false);
});
