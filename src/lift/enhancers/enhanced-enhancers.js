import {lift as liftHusky, test as testForHuskyPresence} from '@form8ion/husky';

export function enhanceHuskyEnhancer(packageManager) {
  return {
    test: testForHuskyPresence,
    lift: ({projectRoot, results}) => liftHusky({projectRoot, results, packageManager})
  };
}
