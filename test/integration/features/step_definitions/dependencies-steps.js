import {Then} from '@cucumber/cucumber';
import * as td from 'testdouble';

import {DEV_DEPENDENCY_TYPE} from '@form8ion/javascript-core';
import any from '@travi/any';

function escapeSpecialCharacters(string) {
  return string.replace(/[.*+?^$\-{}()|[\]\\]/g, '\\$&');
}

export function versionSegment() {
  return any.integer({max: 20});
}
export function semverStringFactory({major = versionSegment()} = {}) {
  return `v${major}.${versionSegment()}.${versionSegment()}`;
}

export function assertDevDependencyIsInstalled(execa, dependencyName) {
  td.verify(
    execa(td.matchers.contains(
      new RegExp(`(npm install|yarn add).*${escapeSpecialCharacters(dependencyName)}.*${DEV_DEPENDENCY_TYPE}`)
    )),
    {ignoreExtraArgs: true}
  );
}

export function assertDependenciesWereRemoved(execa, packageManager, dependencyNames) {
  td.verify(execa(packageManager, td.matchers.contains('remove', ...dependencyNames)));
}

Then('ls-engines is added as a dependency', async function () {
  assertDevDependencyIsInstalled(this.execa, 'ls-engines');
});
