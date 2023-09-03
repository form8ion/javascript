import defineBadges from './badges';

export default async function ({packageName, packageAccessLevel}) {
  return {
    badges: await defineBadges(packageName, packageAccessLevel)
  };
}
