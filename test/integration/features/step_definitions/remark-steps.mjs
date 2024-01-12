import {promises as fs} from 'node:fs';
import {strict as assert} from 'node:assert';
import {fileExists} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';

Given('remark config is in {string} format', async function (format) {
  if ('cjs' === format) {
    await fs.writeFile(
      `${process.cwd()}/.remarkrc.cjs`,
      `// https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#options
exports.settings = {
  listItemIndent: 1,
  emphasis: '_',
  strong: '_',
  bullet: '*',
  incrementListMarker: false
};

exports.plugins = [
  '@form8ion/remark-lint-preset',
  ['remark-toc', {tight: true}],
  ['remark-usage', {heading: 'example'}]
];`
    );
  }
});

Then('remark config exists in {string} format', async function (extension) {
  assert.equal(await fileExists(`${process.cwd()}/.remarkrc.${extension}`), true);
});
