import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the SLSA badge is added to the status group', async function () {
  const {badges} = this.results;

  assert.deepEqual(
    badges.status.slsa,
    {
      img: `https://slsa.dev/images/gh-badge-level2.svg`,
      url: 'https://slsa.dev',
      text: 'SLSA Level 2'
    }
  );
});

Then('no SLSA badge is added', async function () {
  const {badges} = this.results;

  assert.isUndefined(badges?.status.slsa);
});
