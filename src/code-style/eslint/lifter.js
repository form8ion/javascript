import {lift as liftEslint} from '@form8ion/eslint';

export default function ({results: {buildDirectory, eslintConfigs, eslint}, projectRoot}) {
  return liftEslint({projectRoot, configs: [...eslintConfigs || [], ...eslint?.configs || []], buildDirectory});
}
