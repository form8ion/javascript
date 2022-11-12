import {promises as fs} from 'fs';
import {dialects, projectTypes} from '@form8ion/javascript-core';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

import {assertDevDependencyIsInstalled} from './common-steps.mjs';

Then('the package is bundled with rollup', async function () {
  const autoExternal = 'rollup-plugin-auto-external';
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  const {dialect, scaffoldResult: {vcsIgnore}} = this;

  assertDevDependencyIsInstalled(this.execa.default, 'rollup');
  assertDevDependencyIsInstalled(this.execa.default, autoExternal);

  assert.equal(
    await fs.readFile(`${process.cwd()}/rollup.config.mjs`, 'utf-8'),
    `import autoExternal from '${autoExternal}';

export default {
  input: 'src/index.js',
  plugins: [autoExternal()],
  output: [
    {file: 'lib/index.js', format: 'cjs', sourcemap: true},
    {file: 'lib/index.mjs', format: 'es', sourcemap: true}
  ]
};
`
  );
  assert.equal(scripts['build:js'], 'rollup --config');
  assert.equal(scripts.watch, 'run-s \'build:js -- --watch\'');

  if (projectTypes.CLI === this.projectType) {
    assertDevDependencyIsInstalled(this.execa.default, '@rollup/plugin-json');
    assertDevDependencyIsInstalled(this.execa.default, 'rollup-plugin-executable');
  }

  if (dialects.TYPESCRIPT === dialect) {
    assert.include(vcsIgnore.directories, '.rollup.cache/');
    assertDevDependencyIsInstalled(this.execa.default, '@rollup/plugin-typescript');
  }
});
