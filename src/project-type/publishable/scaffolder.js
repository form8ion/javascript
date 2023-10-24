import defineBadges from './badges.js';

export default async function ({packageName, packageAccessLevel}) {
  return {
    badges: await defineBadges(packageName, packageAccessLevel)
  };
}
