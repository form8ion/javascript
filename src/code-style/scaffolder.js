import deepmerge from 'deepmerge';
import {scaffold as scaffoldPrettier} from '@form8ion/prettier';

import {scaffold as scaffoldEslint} from './eslint';
import scaffoldRemark from './remark';

export default async function ({
  projectRoot,
  projectType,
  dialect,
  configs,
  vcs,
  configureLinting,
  eslint
}) {
  return deepmerge.all(await Promise.all([
    configs.eslint
      && configureLinting
      && scaffoldEslint({projectRoot, config: configs.eslint, additionalConfiguration: eslint}),
    scaffoldRemark({
      projectRoot,
      projectType,
      dialect,
      vcs,
      config: configs.remark || '@form8ion/remark-lint-preset'
    }),
    scaffoldPrettier({projectRoot, config: configs.prettier})
  ].filter(Boolean)));
}
