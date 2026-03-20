import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the version badge references the custom registry', async function () {
  const {consumer: {npm: npmBadge}} = this.results.badges;
  const {searchParams} = new URL(npmBadge.img);

  assert.equal(searchParams.get('registry_uri'), this.registries.registry);
});
