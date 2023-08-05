import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {promises as fs} from 'node:fs';

Then('provenance is enabled for publishing', async function () {
  const {publishConfig} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.isTrue(publishConfig.provenance);
  assert.equal(publishConfig.access, 'public');
});

Then('provenance is not enabled for publishing', async function () {
  const {publishConfig} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.isUndefined(publishConfig?.provenance);
});

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
