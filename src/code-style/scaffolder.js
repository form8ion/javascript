import deepmerge from 'deepmerge';
import {scaffold as scaffoldPrettier} from '@form8ion/prettier';
import {scaffold as scaffoldEslint} from '@form8ion/eslint';

import {scaffold as scaffoldRemark} from './remark';

export default async function ({
  projectRoot,
  projectType,
  configs,
  vcs,
  configureLinting
}) {
  return deepmerge.all(await Promise.all([
    configs.eslint
      && configureLinting
      && scaffoldEslint({projectRoot, config: configs.eslint}),
    scaffoldRemark({
      projectRoot,
      projectType,
      vcs,
      config: configs.remark || '@form8ion/remark-lint-preset'
    }),
    scaffoldPrettier({projectRoot, config: configs.prettier})
  ].filter(Boolean)));
}
